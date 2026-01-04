// Gmail MCP Server Launcher
// Loads environment variables and starts the Gmail MCP server

require('dotenv').config();

// Set MCP transport mode
process.env.MCP_TRANSPORT = 'http';

// Start the Gmail MCP server
require('./node_modules/gmail-mcp/dist/main.js');

console.log('Gmail MCP Server starting on http://localhost:' + (process.env.PORT || 3000));
console.log('MCP endpoint: http://localhost:' + (process.env.PORT || 3000) + '/mcp');
