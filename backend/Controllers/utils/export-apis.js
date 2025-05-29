const fs = require('fs');
const path = require('path');

/**
 * Maps API routes from the application and builds a structured representation
 * @param {string} startFilePath - Path to the main index file, defaults to the project's main index.js
 * @return {Object} API structure as a hierarchical object
 */
function mapApiRoutes(startFilePath = null) {
  // Resolve startFilePath to absolute path if not already
  if (!startFilePath) {
    startFilePath = path.join(__dirname, '..', 'index.js');
  } else if (!path.isAbsolute(startFilePath)) {
    startFilePath = path.join(__dirname, startFilePath);
  }

  try {
    const apiStructure = {
      name: 'api',
      type: 'folder',
      children: []
    };
    
    const mainContent = fs.readFileSync(startFilePath, 'utf8');
    const routeMatches = mainContent.matchAll(/router\.use\(['"]\/api\/([^'"]+)['"]/g);
    
    for (const match of routeMatches) {
      const routePath = match[1];
      const apiPath = 'api/' + routePath;
      
      // Determine file path for this route
      const routeSegments = routePath.split('/');
      let currentFilePath = path.dirname(startFilePath);
      
      for (const segment of routeSegments) {
        currentFilePath = path.join(currentFilePath, segment);
      }
      
      const indexFilePath = path.join(currentFilePath, 'index.js');
      
      // Add folder to structure and process its index file
      const folder = addPathToStructure(apiStructure, routePath);
      processIndexFile(indexFilePath, apiPath, folder);
    }
    
    return apiStructure;
  } catch (error) {
    console.error(`Failed to map API routes: ${error.message}`);
    return {
      name: 'api',
      type: 'folder',
      children: []
    };
  }
}

/**
 * Adds a path to the API structure hierarchy
 * @param {Object} structure - The structure to add the path to
 * @param {string} routePath - The route path to add
 * @return {Object} The node representing the added path
 */
function addPathToStructure(structure, routePath) {
  const segments = routePath.split('/').filter(s => s.length > 0);
  let currentNode = structure;
  
  for (const segment of segments) {
    let foundChild = currentNode.children.find(child => child.name === segment);
    
    if (!foundChild) {
      foundChild = {
        name: segment,
        type: 'folder',
        path: currentNode.path ? `${currentNode.path}/${segment}` : `api/${segment}`,
        children: []
      };
      currentNode.children.push(foundChild);
    }
    
    currentNode = foundChild;
  }
  
  return currentNode;
}

/**
 * Processes an index.js file to extract routes and endpoints
 * @param {string} filePath - Path to the index file
 * @param {string} currentPath - Current API path
 * @param {Object} structureNode - Node in the structure to add discovered routes
 */
function processIndexFile(filePath, currentPath, structureNode) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    for (const line of lines) {
      if (line.includes('router.use(')) {
        processNestedRouter(line, filePath, currentPath, structureNode);
      } 
      else if (isEndpointDefinition(line)) {
        processEndpoint(line, filePath, currentPath, structureNode);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

/**
 * Determines if a line contains an endpoint definition
 * @param {string} line - The line to check
 * @return {boolean} True if the line defines an endpoint
 */
function isEndpointDefinition(line) {
  return line.includes('router.') && 
         (line.includes('.get(') || 
          line.includes('.post(') || 
          line.includes('.put(') || 
          line.includes('.delete(') || 
          line.includes('.patch('));
}

/**
 * Processes a nested router line
 * @param {string} line - The line containing the router.use statement
 * @param {string} filePath - Current file path
 * @param {string} currentPath - Current API path
 * @param {Object} structureNode - Current structure node
 */
function processNestedRouter(line, filePath, currentPath, structureNode) {
  const match = line.match(/router\.use\(['"]([^'"]+)['"]/);
  if (!match) return;
  
  let routePath = match[1];
  // Normalize the route path
  if (routePath.startsWith('/')) routePath = routePath.substring(1);
  if (routePath.endsWith('/')) routePath = routePath.substring(0, routePath.length - 1);
  
  // Determine the new file path and API path
  const routeSegments = routePath.split('/');
  const nextFolderName = routeSegments[routeSegments.length - 1];
  const nextFilePath = path.join(path.dirname(filePath), nextFolderName, 'index.js');
  const nextApiPath = currentPath + '/' + routePath;

  // Add the folder to the structure
  const folderNode = {
    name: nextFolderName,
    type: 'folder',
    path: nextApiPath,
    children: []
  };
  structureNode.children.push(folderNode);
  
  // Recursively process the next index file
  processIndexFile(nextFilePath, nextApiPath, folderNode);
}

/**
 * Processes an endpoint definition line
 * @param {string} line - The line containing the endpoint definition
 * @param {string} filePath - Current file path
 * @param {string} currentPath - Current API path
 * @param {Object} structureNode - Current structure node
 */
function processEndpoint(line, filePath, currentPath, structureNode) {
  const methodMatch = line.match(/router\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/);
  if (!methodMatch) return;
  
  const method = methodMatch[1].toUpperCase();
  let endpointPath = methodMatch[2];
  if (endpointPath.startsWith('/')) endpointPath = endpointPath.substring(1);
  
  // Build full API path and determine controller path
  const fullApiPath = `${currentPath}/${endpointPath}`;
  const controllerPath = getControllerPath(filePath, fullApiPath);
  
  // Extract endpoint name
  const endpointName = endpointPath.split('/').pop() || endpointPath;
  
  // Extract schema information
  const schemaInfo = extractSchemaInfo(controllerPath);
  
  // Add the endpoint to the structure
  structureNode.children.push({
    name: endpointName,
    type: 'endpoint',
    method,
    path: fullApiPath,
    controllerPath,
    attributes: schemaInfo.attributes,
    dataLocation: schemaInfo.dataLocation,
    schemaRequired: schemaInfo.hasSchema
  });
}

/**
 * Determines the controller file path based on API path
 * @param {string} indexFilePath - Path to the index file
 * @param {string} apiPath - API path
 * @return {string} Path to the controller file
 */
function getControllerPath(indexFilePath, apiPath) {
  // Extract path after 'api/' prefix
  const pathAfterApi = apiPath.substring(4); // Remove 'api/'

  // Find the backend root directory (where Controllers folder is located)
  const backendRoot = path.resolve(__dirname, '../..');

  // Construct the controller path directly from the backend root
  // This avoids issues with nested routes causing duplicate segments
  return path.join(backendRoot, 'Controllers', pathAfterApi + '.js');
}

/**
 * Extracts schema information from a controller file
 * @param {string} controllerPath - Path to the controller file
 * @return {Object} Schema information
 */
function extractSchemaInfo(controllerPath) {
  try {
    const fullPath = path.isAbsolute(controllerPath) 
      ? controllerPath 
      : path.join(__dirname, controllerPath);

    if (!fs.existsSync(fullPath)) {
      return { hasSchema: false, attributes: [], dataLocation: null };
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    // Improved schema detection with broader patterns
    let hasSchema = content.includes('schema = object') || 
                   content.includes('schema=object') || 
                   content.match(/const\s+schema\s*=\s*object/);
    let dataLocation = null;
    const attributes = [];

    if (hasSchema) {
      // Determine data location (body, query, params) with more robust pattern matching
      if (content.includes('req[\'body\']') || content.includes('req.body') || content.match(/req\s*\[\s*['"]body['"]\s*\]/)) {
        dataLocation = 'body';
      } else if (content.includes('req[\'query\']') || content.includes('req.query') || content.match(/req\s*\[\s*['"]query['"]\s*\]/)) {
        dataLocation = 'query';
      } else if (content.includes('req[\'params\']') || content.includes('req.params') || content.match(/req\s*\[\s*['"]params['"]\s*\]/)) {
        dataLocation = 'params';
      }

      // If no explicit data location is found but we're validating something, assume body
      if (!dataLocation && (content.includes('isValid') || content.includes('validate'))) {
        dataLocation = 'body';
      }

      try {
        // Extract and parse schema definition
        const schemaText = extractSchemaText(content);
        if (schemaText) {
          const objectContent = extractObjectContent(schemaText);
          if (objectContent) {
            attributes.push(...parseObjectAttributes(objectContent));
          }
        }
      } catch (parseError) {
        console.error(`Error parsing schema in ${controllerPath}: ${parseError.message}`);
        // Continue with empty attributes rather than failing
      }
    }

    return { hasSchema, attributes, dataLocation };
  } catch (error) {
    console.error(`Error extracting schema from ${controllerPath}: ${error.message}`);
    return { hasSchema: false, attributes: [], dataLocation: null };
  }
}

/**
 * Extracts schema text from controller content
 * @param {string} content - Controller file content
 * @return {string} Extracted schema text
 */
function extractSchemaText(content) {
  const lines = content.split('\n');
  let inSchemaDefinition = false;
  let bracketCount = 0;
  let schemaText = '';

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Improved pattern matching for schema definitions
    if ((trimmedLine.includes('schema = object(') || 
         trimmedLine.includes('schema = object (') ||
         trimmedLine.match(/schema\s*=\s*object\s*\(/))) {

      // Start capturing schema definition
      inSchemaDefinition = true;
      schemaText += trimmedLine + '\n';

      // Set initial bracket count based on whether this line contains opening brace
      bracketCount = trimmedLine.includes('{') ? 1 : 0;

      continue;
    }

    // Handle case where object definition and opening brace are on separate lines
    if (inSchemaDefinition && bracketCount === 0 && trimmedLine.includes('{')) {
      bracketCount = 1;
      schemaText += trimmedLine + '\n';
      continue;
    }

    if (inSchemaDefinition) {
      schemaText += trimmedLine + '\n';

      // Count brackets to find the end of the schema
      const openingBrackets = (trimmedLine.match(/{/g) || []).length;
      const closingBrackets = (trimmedLine.match(/}/g) || []).length;
      bracketCount += openingBrackets - closingBrackets;

      if (bracketCount <= 0) {
        inSchemaDefinition = false;
        break; // End of schema definition
      }
    }
  }

  return schemaText;
}

/**
 * Extracts object content from schema text
 * @param {string} schemaText - Schema definition text
 * @return {string} Object content
 */
function extractObjectContent(schemaText) {
  // More flexible object pattern matching
  if (!schemaText.match(/object\s*\(/)) {
    return null;
  }

  const startPos = schemaText.indexOf('object');
  const openParenPos = schemaText.indexOf('(', startPos);
  
  if (openParenPos === -1) return null;
  
  const openBracePos = schemaText.indexOf('{', openParenPos);
  if (openBracePos === -1) return null;
  
  // Find matching closing brace
  let braceLevel = 1;
  let closeBracePos = -1;
  
  for (let i = openBracePos + 1; i < schemaText.length; i++) {
    if (schemaText[i] === '{') {
      braceLevel++;
    } else if (schemaText[i] === '}') {
      braceLevel--;
      if (braceLevel === 0) {
        closeBracePos = i;
        break;
      }
    }
  }
  
  if (closeBracePos === -1) return null;
  
  return schemaText.substring(openBracePos + 1, closeBracePos).trim();
}

/**
 * Parses field definition from schema
 * @param {string} name - Field name
 * @param {string} definition - Field definition
 * @return {Object} Parsed field information
 */
function parseFieldDefinition(name, definition) {
  const typeMatch = definition.match(/^(\w+)\s*\(/);
  if (!typeMatch) return null;

  const type = typeMatch[1];
  const fieldInfo = {
    name,
    type,
    required: false,
    limitations: {}
  };

  // Handle nested objects
  if (type === 'object') {
    const nestedContent = extractNestedObjectContent(definition);
    if (nestedContent) {
      fieldInfo.attributes = parseObjectAttributes(nestedContent.content);
      definition = definition.replace(nestedContent.processedPart, 'object()');
    }
  }

  // Process method chains
  processMethodChain(definition, fieldInfo);

  return fieldInfo;
}

/**
 * Extracts content of a nested object
 * @param {string} definition - Field definition
 * @return {Object} Extracted content and processed part
 */
function extractNestedObjectContent(definition) {
  let objectContent = '';
  let openBraces = 0;
  let closeBraces = 0;
  let startIndex = definition.indexOf('(') + 1;

  // Find the opening brace after 'object('
  while (startIndex < definition.length && definition[startIndex] !== '{') {
    startIndex++;
  }

  if (startIndex >= definition.length) return null;

  // Found opening brace, now extract the content with balanced braces
  let i = startIndex;
  openBraces = 1; // Count the opening brace we just found

  while (i < definition.length && openBraces > closeBraces) {
    i++;
    if (definition[i] === '{') openBraces++;
    else if (definition[i] === '}') closeBraces++;
  }

  // Extract the content between the outermost braces
  if (openBraces === closeBraces && i > startIndex) {
    objectContent = definition.substring(startIndex + 1, i);
    const processedPart = definition.substring(0, i + 1);
    
    return {
      content: objectContent,
      processedPart
    };
  }

  return null;
}

/**
 * Processes method chain in field definition
 * @param {string} definition - Field definition
 * @param {Object} fieldInfo - Field information object to update
 */
function processMethodChain(definition, fieldInfo) {
  let currentPos = 0;
  let remainingDef = definition;
  
  // Skip the initial type definition
  const initialTypeCall = remainingDef.match(/^\w+\s*\([^)]*\)/);
  if (initialTypeCall) {
    currentPos = initialTypeCall[0].length;
    remainingDef = remainingDef.substring(currentPos);
  }
  
  // Process each method in the chain
  while (remainingDef.length > 0 && remainingDef.startsWith('.')) {
    const methodNameMatch = remainingDef.match(/^\.(\w+)\s*\(/);
    if (!methodNameMatch) break;
    
    const methodName = methodNameMatch[1];
    remainingDef = remainingDef.substring(methodNameMatch[0].length);
    
    // Extract method parameters with balanced parentheses
    const paramInfo = extractBalancedParams(remainingDef);
    if (!paramInfo) break;
    
    remainingDef = remainingDef.substring(paramInfo.length);
    
    // Process the method based on its name
    if (methodName === 'required') {
      fieldInfo.required = true;
    } else if (methodName === 'of' && fieldInfo.type === 'array') {
      // Special handling for array .of() method
      fieldInfo.of = parseFieldDefinition('item', paramInfo.content);
    } else if (paramInfo.content.length > 0) {
      parseMethodParameter(methodName, paramInfo.content, fieldInfo);
    } else {
      fieldInfo.limitations[methodName] = true;
    }
  }
}

/**
 * Extracts balanced parameters from a method call
 * @param {string} text - Method parameters text
 * @return {Object} Parameter content and total length
 */
function extractBalancedParams(text) {
  let paramContent = '';
  let openParens = 1; // We've already passed the opening paren
  let closeParens = 0;
  let i = 0;
  
  while (i < text.length && openParens > closeParens) {
    if (text[i] === '(') openParens++;
    else if (text[i] === ')') closeParens++;
    
    if (openParens > closeParens) {
      paramContent += text[i];
    }
    i++;
  }
  
  if (openParens !== closeParens) return null;
  
  return {
    content: paramContent,
    length: i
  };
}

/**
 * Parses a method parameter value
 * @param {string} methodName - Method name
 * @param {string} paramContent - Parameter content
 * @param {Object} fieldInfo - Field information to update
 */
function parseMethodParameter(methodName, paramContent, fieldInfo) {
  try {
    // Try to parse as JSON if it looks like an array or complex structure
    if (paramContent.startsWith('[') || paramContent.startsWith('{')) {
      fieldInfo.limitations[methodName] = JSON.parse(paramContent);
    } else if (!isNaN(paramContent)) {
      // Parse as number if it's numeric
      fieldInfo.limitations[methodName] = parseFloat(paramContent);
    } else {
      // Keep as string for other cases (might be quoted strings)
      fieldInfo.limitations[methodName] = paramContent.replace(/['"]/g, '');
    }
  } catch (e) {
    // If JSON parsing fails, keep as string
    fieldInfo.limitations[methodName] = paramContent;
  }
}

/**
 * Parses object attributes from schema content
 * @param {string} objectContent - Object content from schema
 * @return {Array} Array of parsed attributes
 */
function parseObjectAttributes(objectContent) {
  const attributes = [];
  
  // Parse the object content character by character to handle nested structures
  let currentPos = 0;
  let inQuotes = false;
  let bracketLevel = 0;
  let currentAttribute = '';
  
  while (currentPos < objectContent.length) {
    const char = objectContent[currentPos];
    
    // Handle quotes to properly detect string literals
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    }
    
    // Track bracket levels for nested structures
    if (!inQuotes) {
      if (char === '{' || char === '[' || char === '(') {
        bracketLevel++;
      } else if (char === '}' || char === ']' || char === ')') {
        bracketLevel--;
      }
    }
    
    currentAttribute += char;
    
    // Process attribute at comma or end of content
    if ((char === ',' && bracketLevel === 0 && !inQuotes) || 
        currentPos === objectContent.length - 1) {
      processAttribute(currentAttribute.trim());
      currentAttribute = '';
    }
    
    currentPos++;
  }
  
  function processAttribute(attrStr) {
    const colonPos = attrStr.indexOf(':');
    if (colonPos > 0) {
      const name = attrStr.substring(0, colonPos).trim().replace(/['"]/g, '');
      const definition = attrStr.substring(colonPos + 1).trim();
      
      const fieldInfo = parseFieldDefinition(name, definition);
      if (fieldInfo) {
        attributes.push(fieldInfo);
      }
    }
  }
  
  return attributes;
}

/**
 * Resolves a path relative to the project root directory
 * @param {string} relativePath - Path relative to project root
 * @returns {string} Absolute path
 */
function resolveProjectPath(relativePath) {
  return path.join(__dirname, '..', '..', relativePath);
}

// Export the main function and utility
module.exports = mapApiRoutes;
module.exports.resolveProjectPath = resolveProjectPath;

// Only run the mapping if this file is executed directly
if (require.main === module) {
  // Use the default path resolution when run directly
  const apiStructure = mapApiRoutes();

  // Ensure dump directory exists
  const dumpDir = path.join(__dirname, '..', '..', 'dump');
  if (!fs.existsSync(dumpDir)) {
    fs.mkdirSync(dumpDir, { recursive: true });
  }

  // Save to an absolute path
  const outputPath = path.join(dumpDir, 'api-structure.json');
  fs.writeFileSync(outputPath, JSON.stringify(apiStructure, null, 2));

  // Save a debug log of schema detection results
  const schemaDebugPath = path.join(dumpDir, 'schema-debug.log');
  const schemaDebugLog = apiStructure.children
    .flatMap(folder => folder.children)
    .flatMap(subfolder => subfolder.type === 'folder' ? subfolder.children : [subfolder])
    .flatMap(item => item.type === 'folder' ? item.children : [item])
    .filter(endpoint => endpoint.type === 'endpoint')
    .map(endpoint => `${endpoint.path}: hasSchema=${endpoint.schemaRequired}, attributes=${endpoint.attributes.length}, dataLocation=${endpoint.dataLocation || 'none'}, controllerPath=${endpoint.controllerPath}`)
    .join('\n');

  fs.writeFileSync(schemaDebugPath, schemaDebugLog);
  console.log(`API structure saved to ${outputPath}`);
  console.log(`Schema debug log saved to ${schemaDebugPath}`);
}
