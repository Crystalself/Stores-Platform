const fs = require('fs');
const path = require('path');
const mapApiRoutes = require('./export-apis');

/**
 * Converts API structure to Postman Collection format
 * @param {Object} apiStructure - API structure from mapApiRoutes()
 * @param {Object} options - Configuration options
 * @returns {Object} Postman Collection JSON
 */
function convertToPostmanCollection(apiStructure, options = {}) {
  const {
    collectionName = 'API Collection',
    collectionDescription = 'Generated API Collection',
    baseUrl = `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}`,
    includeTests = true,
    includeEnvironment = true
  } = options;

  // Initialize Postman Collection structure
  const collection = {
    info: {
      _postman_id: generateUUID(),
      name: collectionName,
      description: collectionDescription,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [],
    variable: [
      {
        key: "baseUrl",
        value: baseUrl,
        type: "string"
      }
    ]
  };

  // Process API structure recursively
  processApiNode(apiStructure, collection.item, baseUrl);
  
  return collection;
}

/**
 * Processes an API node (folder or endpoint) and adds it to the Postman items
 * @param {Object} node - API node to process
 * @param {Array} parentItems - Parent items array to add to
 * @param baseUrl
 */
function processApiNode(node, parentItems, baseUrl = `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}`) {
  if (node.type === 'folder') {
    // Create a folder in Postman collection
    const folder = {
      name: node.name,
      item: [],
      description: `API endpoints for ${node.path || node.name}`
    };
    
    // Process children recursively
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        processApiNode(child, folder.item, baseUrl);
      }
    }
    
    // Only add folder if it has items
    if (folder.item.length > 0) {
      parentItems.push(folder);
    }
  } 
  else if (node.type === 'endpoint') {
    // Create a request item
    const request = createPostmanRequest(node, baseUrl);
    parentItems.push(request);
  }
}

/**
 * Creates a Postman request item from an API endpoint
 * @param {Object} endpoint - API endpoint definition
 * @param baseUrl
 * @returns {Object} Postman request item
 */
function createPostmanRequest(endpoint, baseUrl) {
  const requestItem = {
    name: endpoint.name,
    request: {
      method: endpoint.method,
      header: [
        {
          key: "Content-Type",
          value: "application/json"
        }
      ],
      url: {
        raw: `${baseUrl}/${endpoint.path}`,
        host: [baseUrl],
        path: endpoint.path.split('/')
      },
      description: `${endpoint.method} ${endpoint.path}`
    },
    response: []
  };

  // Add request body if needed (for POST, PUT, PATCH)
  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.attributes && endpoint.attributes.length > 0) {
    requestItem.request.body = {
      mode: "raw",
      raw: JSON.stringify(generateSampleData(endpoint.attributes), null, 2),
      options: {
        raw: {
          language: "json"
        }
      }
    };
  }
  
  // Add query parameters if needed (for GET with schema)
  if (endpoint.method === 'GET' && endpoint.dataLocation === 'query' && endpoint.attributes && endpoint.attributes.length > 0) {
    requestItem.request.url.query = endpoint.attributes.map(attr => ({
      key: attr.name,
      value: generateSampleValue(attr),
      description: getAttributeDescription(attr)
    }));
  }
  
  // Add tests if needed
  if (endpoint.schemaRequired) {
    requestItem.event = [
      {
        listen: "test",
        script: {
          exec: generateTestScript(endpoint),
          type: "text/javascript"
        }
      }
    ];
  }
  
  return requestItem;
}

/**
 * Generates sample data based on attribute schema
 * @param {Array} attributes - Schema attributes
 * @returns {Object} Sample data object
 */
function generateSampleData(attributes) {
  const result = {};
  
  if (!attributes || !attributes.length) return result;
  
  for (const attr of attributes) {
    result[attr.name] = generateSampleValue(attr);
  }
  
  return result;
}

/**
 * Generates a sample value for an attribute based on its schema
 * @param {Object} attr - Attribute schema
 * @returns {any} Sample value
 */
function generateSampleValue(attr) {
  const { type, limitations, required, attributes, of } = attr;
  
  // Handle nullability for non-required fields
  if (!required && Math.random() > 0.7) {
    return null;
  }
  
  switch (type) {
    case 'string':
      if (limitations.oneOf && limitations.oneOf.length > 0) {
        return limitations.oneOf[0];
      }
      if (limitations.email) {
        return 'user@example.com';
      }
      const minLength = limitations.min || 3;
      const maxLength = limitations.max || 10;
      const length = Math.min(Math.max(minLength, 5), maxLength);
      return `sample_${attr.name}`.substring(0, length);
      
    case 'number':
    case 'integer':
      const min = limitations.min !== undefined ? limitations.min : 1;
      const max = limitations.max !== undefined ? limitations.max : 100;
      return min;
      
    case 'boolean':
      return true;
      
    case 'array':
      const items = [];
      const count = Math.min(2, limitations.max || 2);
      for (let i = 0; i < count; i++) {
        if (of) {
          items.push(generateSampleValue(of));
        } else {
          items.push(i + 1);
        }
      }
      return items;
      
    case 'object':
      if (attributes && attributes.length > 0) {
        return generateSampleData(attributes);
      }
      return { example: "value" };
      
    default:
      return `sample_${attr.name}`;
  }
}

/**
 * Generates a description for an attribute
 * @param {Object} attr - Attribute schema
 * @returns {string} Description
 */
function getAttributeDescription(attr) {
  const parts = [];
  
  parts.push(`Type: ${attr.type}`);
  
  if (attr.required) {
    parts.push('Required');
  }
  
  if (attr.limitations) {
    if (attr.limitations.min !== undefined) {
      parts.push(`Min: ${attr.limitations.min}`);
    }
    if (attr.limitations.max !== undefined) {
      parts.push(`Max: ${attr.limitations.max}`);
    }
    if (attr.limitations.oneOf) {
      parts.push(`Values: ${attr.limitations.oneOf.join(', ')}`);
    }
  }
  
  return parts.join(' | ');
}

/**
 * Generates a test script for validating endpoint responses
 * @param {Object} endpoint - API endpoint definition
 * @returns {Array} Test script lines
 */
function generateTestScript(endpoint) {
  const tests = [
    "pm.test(\"Status code is 200\", function () {",
    "    pm.response.to.have.status(200);",
    "});",
    "",
    "pm.test(\"Response has valid structure\", function () {",
    "    var jsonData = pm.response.json();",
    "    pm.expect(jsonData).to.be.an('object');",
    "    pm.expect(jsonData.success).to.be.a('boolean');",
    "});"
  ];
  
  return tests;
}

/**
 * Generates a Postman environment file
 * @param {Object} options - Configuration options
 * @returns {Object} Postman environment JSON
 */
function generatePostmanEnvironment(options = {}) {
  const {
    environmentName = 'API Environment',
    baseUrl = `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}`,
    authToken = ''
  } = options;
  
  return {
    id: generateUUID(),
    name: environmentName,
    values: [
      {
        key: "baseUrl",
        value: baseUrl,
        type: "default",
        enabled: true
      },
      {
        key: "authToken",
        value: authToken,
        type: "default",
        enabled: true
      }
    ],
    _postman_variable_scope: "environment"
  };
}

/**
 * Generates a UUID v4
 * @returns {string} UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Exports the API structure as a Postman collection
 * @param {string} apiFilePath - Path to JSON file with API structure or null to generate it
 * @param {string} outputDir - Output directory name or full path (if it starts with / or contains :\)
 * @param {Object} options - Configuration options
 */
function exportToPostman(apiFilePath = null, outputDir = 'dump', options = null) {
  try {
    options = options? options : {
      collectionName:  process.env.NAME || "" + 'API Collection',
      baseUrl:  `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}`,
      includeTests: true,
      includeEnvironment: false
    };
    // Check if outputDir is already an absolute path or contains drive letter (Windows)
    const isAbsolutePath = path.isAbsolute(outputDir) || /^[A-Z]:\\/.test(outputDir);

    let fullOutputDir;

    if (isAbsolutePath) {
      // Use the provided path directly
      fullOutputDir = outputDir;
    } else {
      // Resolve to the dump directory in project
      fullOutputDir = path.join(__dirname, '..', '..', outputDir);
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(fullOutputDir)) {
      fs.mkdirSync(fullOutputDir, { recursive: true });
    }
    
    // Get API structure
    let apiStructure;
    if (apiFilePath) {
      // Resolve absolute path if apiFilePath is provided
      const fullApiFilePath = path.isAbsolute(apiFilePath) 
        ? apiFilePath 
        : path.join(__dirname, apiFilePath);

      if (fs.existsSync(fullApiFilePath)) {
        const apiJson = fs.readFileSync(fullApiFilePath, 'utf8');
        apiStructure = JSON.parse(apiJson);
      } else {
        console.warn(`API file not found at ${fullApiFilePath}, generating structure...`);
        apiStructure = mapApiRoutes(path.join(__dirname, '../index.js'));
      }
    } else {
      console.log('Generating API structure...');
      apiStructure = mapApiRoutes(path.join(__dirname, '../index.js'));
    }
    
    // Convert to Postman collection
    const collection = convertToPostmanCollection(apiStructure, options);
    const collectionPath = path.join(fullOutputDir, 'postman_collection.json');
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    console.log(`Postman collection exported to ${collectionPath}`);

    // Generate environment file if needed
    if (options.includeEnvironment !== false) {
      const environment = generatePostmanEnvironment(options);
      const envPath = path.join(fullOutputDir, 'postman_environment.json');
      fs.writeFileSync(envPath, JSON.stringify(environment, null, 2));
      console.log(`Postman environment exported to ${envPath}`);
    }
    
    return {
      collectionPath,
      environmentPath: options.includeEnvironment !== false ? path.join(fullOutputDir, 'postman_environment.json') : null
    };
  } catch (error) {
    console.error(`Failed to export to Postman: ${error.message}`);
    throw error;
  }
}

/**
 * Resolves a path relative to the project root directory
 * @param {string} relativePath - Path relative to project root
 * @returns {string} Absolute path
 */
function resolveProjectPath(relativePath) {
  return path.join(__dirname, '..', '..', relativePath);
}

module.exports = {
  convertToPostmanCollection,
  exportToPostman,
  generatePostmanEnvironment,
  resolveProjectPath
};

if (require.main === module) {
  // When run directly, use absolute paths
  exportToPostman(null, 'dump');
}
