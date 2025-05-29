const fs = require('fs');
const path = require('path');
const mapApiRoutes = require('./export-apis');

/**
 * Converts API structure to Swagger/OpenAPI annotations
 * @param {Object} apiStructure - API structure from mapApiRoutes()
 * @param {Object} options - Configuration options
 * @returns {Object} Swagger/OpenAPI specifications object
 */
function convertToSwaggerDocs(apiStructure, options = {}) {
  const {
    title = 'API Documentation',
    description = 'Generated API Documentation',
    version = '1.0.0',
    baseUrl = `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}`,
    securitySchemes = {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  } = options;

  // Initialize Swagger structure
  const swaggerDocs = {
    openapi: '3.0.0',
    info: {
      title,
      description,
      version
    },
    servers: [
      {
        url: baseUrl,
        description: 'Development server'
      }
    ],
    tags: [], // Will be populated with all unique tags
    paths: {},
    components: {
      schemas: {},
      securitySchemes
    }
  };

  // Track all tags and their hierarchies
  const tagHierarchy = {};

  // Process API structure recursively with tag hierarchy tracking
  processApiNode(apiStructure, swaggerDocs, tagHierarchy);
  
  return swaggerDocs;
}

/**
 * Processes an API node (folder or endpoint) and adds it to the Swagger paths
 * @param {Object} node - API node to process
 * @param {Object} swaggerDocs - Swagger document to update
 * @param {Object} tagHierarchy - Hierarchy of collected tags
 * @param {string} parentPath - Path of parent node
 * @returns {Object} - Object containing hasEndpoints (any endpoints) and hasDirectEndpoints flags
 */
function processApiNode(node, swaggerDocs, tagHierarchy = {}, parentPath = '') {
  // Calculate current path
  const currentPath = node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);

  // Track direct endpoints and child endpoints separately
  let hasEndpoints = false;
  let hasDirectEndpoints = false;

  if (node.type === 'folder' && node.children && node.children.length > 0) {
    // Count direct endpoint children
    const directEndpoints = node.children.filter(child => child.type === 'endpoint').length;
    hasDirectEndpoints = directEndpoints > 0;

    // Process children recursively
    for (const child of node.children) {
      const childResult = processApiNode(child, swaggerDocs, tagHierarchy, currentPath);
      // Track if any child has endpoints
      hasEndpoints = hasEndpoints || childResult.hasEndpoints;
    }

    // Only add folder to tag hierarchy if it has DIRECT endpoints and is not 'api'
    if (hasDirectEndpoints && currentPath && !currentPath.endsWith('/api') && currentPath !== 'api') {
      const segments = currentPath.split('/').filter(s => s !== 'api');

      // Only proceed if we have segments
      if (segments.length > 0) {
        const tagPath = segments.join('/');

        // Add tag to hierarchy if not already there
        if (!tagHierarchy[tagPath]) {
          tagHierarchy[tagPath] = {
            name: tagPath,
            description: `Operations related to ${tagPath}`,
            parent: tagPath.includes('/') ? tagPath.substring(0, tagPath.lastIndexOf('/')) : null,
            hasDirectEndpoints: true
          };
        } else {
          // Update existing tag
          tagHierarchy[tagPath].hasDirectEndpoints = true;
        }
      }
    }
  } 
  else if (node.type === 'endpoint') {
    // Create a path entry
    addPathToSwagger(node, swaggerDocs, tagHierarchy);

    // Add schema components if needed
    if (node.attributes && node.attributes.length > 0) {
      addSchemaComponents(node, swaggerDocs);
    }

    hasEndpoints = true;
    hasDirectEndpoints = true;
  }

  // After processing all nodes, add tags to swagger docs
  if (parentPath === '') {
    // Filter to include ONLY tags that have direct endpoints
    const tagsWithDirectEndpoints = Object.values(tagHierarchy)
      .filter(tag => tag.hasDirectEndpoints === true);

    // Convert tag hierarchy to array and add to Swagger docs
    swaggerDocs.tags = tagsWithDirectEndpoints.map(tag => ({
      name: tag.name,
      description: tag.description
    }));

    // Sort tags by name for consistency
    swaggerDocs.tags.sort((a, b) => a.name.localeCompare(b.name));
  }

  return { hasEndpoints, hasDirectEndpoints };
}

/**
 * Adds an API endpoint to the Swagger paths
 * @param {Object} endpoint - API endpoint definition
 * @param {Object} swaggerDocs - Swagger document to update
 * @param {Object} tagHierarchy - Hierarchy of collected tags
 */
function addPathToSwagger(endpoint, swaggerDocs, tagHierarchy = {}) {
  const { method, path, name, attributes, dataLocation } = endpoint;
  const methodLower = method.toLowerCase();

  // Format path for Swagger (convert api/v1/user to /api/v1/user)
  const swaggerPath = '/' + path;

  // Initialize path if it doesn't exist
  if (!swaggerDocs.paths[swaggerPath]) {
    swaggerDocs.paths[swaggerPath] = {};
  }

  // Get the appropriate tag for this endpoint
  const endpointTags = getTagsFromPath(path);

  // Ensure the tag exists in our hierarchy
  endpointTags.forEach(tag => {
    if (!tagHierarchy[tag]) {
      tagHierarchy[tag] = {
        name: tag,
        description: `Operations related to ${tag}`,
        parent: tag.includes('/') ? tag.substring(0, tag.lastIndexOf('/')) : null,
        hasDirectEndpoints: true // Mark this tag as having direct endpoints
      };
    } else {
      // Mark existing tag as having direct endpoints
      tagHierarchy[tag].hasDirectEndpoints = true;
    }
  });

  // Create path operation object
  const operation = {
    tags: endpointTags,
    summary: `${method} ${name}`,
    description: `${method} request to ${path}`,
    operationId: `${methodLower}${capitalizePathSegments(path)}`,
    parameters: [],
    responses: {
      '200': {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                data: {
                  type: 'object'
                }
              }
            }
          }
        }
      },
      '400': {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                error: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                error: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  };

  // Add security if path contains auth
  if (path.includes('auth') && !path.includes('login')) {
    operation.security = [{ bearerAuth: [] }];
  }
  
  // Add request body for POST, PUT, PATCH
  if (['post', 'put', 'patch'].includes(methodLower) && attributes && attributes.length > 0) {
    if (dataLocation === 'body' || !dataLocation) {
      operation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${getSchemaNameFromPath(path)}`
            }
          }
        }
      };
    }
  }
  
  // Add query parameters
  if (attributes && attributes.length > 0) {
    if (dataLocation === 'query' || (methodLower === 'get' && !dataLocation)) {
      for (const attr of attributes) {
        operation.parameters.push(createParameter(attr, 'query'));
      }
    } else if (dataLocation === 'params') {
      for (const attr of attributes) {
        operation.parameters.push(createParameter(attr, 'path'));
      }
    }
  }
  
  // Add the operation to the path
  swaggerDocs.paths[swaggerPath][methodLower] = operation;
}

/**
 * Creates a parameter object for Swagger
 * @param {Object} attr - Attribute definition
 * @param {string} paramType - Parameter type (query, path, header)
 * @returns {Object} Swagger parameter object
 */
function createParameter(attr, paramType) {
  const parameter = {
    name: attr.name,
    in: paramType,
    description: getAttributeDescription(attr),
    required: attr.required === true,
    schema: createParameterSchema(attr)
  };
  
  return parameter;
}

/**
 * Creates a schema for a parameter
 * @param {Object} attr - Attribute definition
 * @returns {Object} Swagger schema object
 */
function createParameterSchema(attr) {
  const schema = {
    type: mapType(attr.type)
  };
  
  // Add format for specific types
  if (attr.type === 'string' && attr.limitations && attr.limitations.email) {
    schema.format = 'email';
  }
  
  // Add enum values
  if (attr.limitations && attr.limitations.oneOf) {
    schema.enum = attr.limitations.oneOf;
  }
  
  // Add min/max constraints
  if (attr.limitations) {
    if (attr.limitations.min !== undefined) {
      if (attr.type === 'string') {
        schema.minLength = attr.limitations.min;
      } else {
        schema.minimum = attr.limitations.min;
      }
    }
    if (attr.limitations.max !== undefined) {
      if (attr.type === 'string') {
        schema.maxLength = attr.limitations.max;
      } else {
        schema.maximum = attr.limitations.max;
      }
    }
  }
  
  // Handle array type
  if (attr.type === 'array' && attr.of) {
    schema.items = createParameterSchema(attr.of);
  }
  
  // Handle object type
  if (attr.type === 'object' && attr.attributes && attr.attributes.length > 0) {
    schema.properties = {};
    schema.required = [];
    
    for (const nestedAttr of attr.attributes) {
      schema.properties[nestedAttr.name] = createParameterSchema(nestedAttr);
      if (nestedAttr.required) {
        schema.required.push(nestedAttr.name);
      }
    }
    
    if (schema.required.length === 0) {
      delete schema.required;
    }
  }
  
  return schema;
}

/**
 * Adds schema components to the Swagger document
 * @param {Object} endpoint - API endpoint definition
 * @param {Object} swaggerDocs - Swagger document to update
 */
function addSchemaComponents(endpoint, swaggerDocs) {
  const { path, attributes } = endpoint;
  const schemaName = getSchemaNameFromPath(path);
  
  // Skip if schema already exists
  if (swaggerDocs.components.schemas[schemaName]) {
    return;
  }
  
  // Create schema
  const schema = {
    type: 'object',
    properties: {},
    required: []
  };
  
  // Add properties
  for (const attr of attributes) {
    schema.properties[attr.name] = createParameterSchema(attr);
    if (attr.required) {
      schema.required.push(attr.name);
    }
  }
  
  // Remove required array if empty
  if (schema.required.length === 0) {
    delete schema.required;
  }
  
  // Add schema to components
  swaggerDocs.components.schemas[schemaName] = schema;
}

/**
 * Generates a schema name from an API path
 * @param {string} path - API path
 * @returns {string} Schema name
 */
function getSchemaNameFromPath(path) {
  const segments = path.split('/').filter(s => s !== 'api');
  return segments.map(capitalize).join('') + 'Schema';
}

/**
 * Extracts tags from an API path
 * @param {string} path - API path
 * @returns {Array} Array of tags
 */
function getTagsFromPath(path) {
  const segments = path.split('/').filter(s => s !== 'api');
  
  if (segments.length === 0) {
    return ['api'];
  }

  // If only one segment, use it as the tag
  if (segments.length === 1) {
    return [segments[0]];
  }

  // For endpoints, use their direct parent folder as the tag
  // Extract all segments except the last one (which is the endpoint name)
  const directParentFolder = segments.slice(0, segments.length - 1).join('/');
  return [directParentFolder];
}

/**
 * Capitalizes path segments for operationId
 * @param {string} path - API path
 * @returns {string} Camel-cased path
 */
function capitalizePathSegments(path) {
  return path.split('/')
    .filter(s => s !== 'api')
    .map(capitalize)
    .join('');
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Maps schema type to Swagger type
 * @param {string} type - Schema type
 * @returns {string} Swagger type
 */
function mapType(type) {
  const typeMap = {
    'string': 'string',
    'number': 'number',
    'integer': 'integer',
    'boolean': 'boolean',
    'array': 'array',
    'object': 'object'
  };
  
  return typeMap[type] || 'string';
}

/**
 * Generates a description for an attribute
 * @param {Object} attr - Attribute schema
 * @returns {string} Description
 */
function getAttributeDescription(attr) {
  const parts = [];
  
  parts.push(`${attr.name} (${attr.type})`);
  
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
 * Exports the API structure as a Swagger annotations file
 * @param {string} apiFilePath - Path to JSON file with API structure or null to generate it
 * @param {string} outputPath - Path to output file name or full path (if it starts with / or contains :\)
 * @param {Object} options - Configuration options
 */
function exportToSwagger(apiFilePath = null, outputPath = 'swagger-docs.json', options = null) {
  try {
    options = options || {
      title: process.env.NAME || 'API Documentation',
      description: 'Generated API Documentation using Swagger',
      version: '1.0.0',
      baseUrl: `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}`
    };
    
    // Check if outputPath is already an absolute path or contains drive letter (Windows)
    const isAbsolutePath = path.isAbsolute(outputPath) || /^[A-Z]:\\/.test(outputPath);

    let fullOutputPath;

    if (isAbsolutePath) {
      // Use the provided path directly, ensuring parent directory exists
      fullOutputPath = outputPath;
      const outputDir = path.dirname(fullOutputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
    } else {
      // Resolve to the dump directory in project
      const dumpDir = path.join(__dirname, '..', '..', 'dump');
      if (!fs.existsSync(dumpDir)) {
        fs.mkdirSync(dumpDir, { recursive: true });
      }
      fullOutputPath = path.join(dumpDir, outputPath);
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
    
    // Convert to Swagger docs
    const swaggerDocs = convertToSwaggerDocs(apiStructure, options);
    
    // Write JSON file directly
    fs.writeFileSync(fullOutputPath, JSON.stringify(swaggerDocs, null, 2));
    console.log(`Swagger annotations exported to ${fullOutputPath}`);

    return {
      outputPath: fullOutputPath,
      swaggerDocs
    };
  } catch (error) {
    console.error(`Failed to export to Swagger: ${error.message}`);
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
  convertToSwaggerDocs,
  exportToSwagger,
  resolveProjectPath
};

if (require.main === module) {
  // When run directly, use absolute paths
  const outputFile = 'swagger-docs.json';
  exportToSwagger(null, outputFile);
}
