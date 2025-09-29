/* eslint-disable @typescript-eslint/no-unused-vars */
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Swagger generation...');
console.log('📁 Current working directory:', process.cwd());
console.log('📁 Script directory:', __dirname);

// Try multiple possible locations for swaggerDef
let swaggerDefinition;
try {
  // Try dist first (for production)
  swaggerDefinition = require('../dist/swaggerDef');
  console.log('✅ Found swaggerDef in dist/swaggerDef');
} catch (err) {
  try {
    swaggerDefinition = require('../dist/swaggerDef').default;
    console.log('✅ Found swaggerDef in dist/swaggerDef.default');
  } catch (err2) {
    try {
      // Fallback to src (for development)
      swaggerDefinition = require('../src/swaggerDef').default;
      console.log('✅ Found swaggerDef in src/swaggerDef.default');
    } catch (err3) {
      console.error('❌ Could not find swaggerDef in any location:');
      console.error('   - dist/swaggerDef:', err.message);
      console.error('   - dist/swaggerDef.default:', err2.message);
      console.error('   - src/swaggerDef.default:', err3.message);
      
      // List directory contents for debugging
      console.log('📁 dist directory contents:');
      try {
        const distFiles = fs.readdirSync(path.join(__dirname, '../dist'));
        console.log('   ', distFiles);
      } catch (e) {
        console.log('   dist directory does not exist');
      }
      
      process.exit(1);
    }
  }
}

const options = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, '../dist/routes/**/*.js'),
    path.join(__dirname, '../dist/controllers/**/*.js'),
    path.join(__dirname, '../src/routes/**/*.ts'), // Fallback for development
    path.join(__dirname, '../src/controllers/**/*.ts')
  ],
};

console.log('🔍 Looking for API files...');
options.apis.forEach(apiPath => {
  console.log('   -', apiPath);
});

// Check if API files exist
const glob = require('glob');
let foundFiles = [];
options.apis.forEach(pattern => {
  const files = glob.sync(pattern);
  foundFiles = foundFiles.concat(files);
  console.log(`📄 Found ${files.length} files for pattern: ${pattern}`);
  if (files.length > 0) {
    files.slice(0, 3).forEach(file => console.log(`      ${file}`));
    if (files.length > 3) console.log(`      ... and ${files.length - 3} more`);
  }
});

if (foundFiles.length === 0) {
  console.warn('⚠️  No API files found! Check your file patterns.');
}

const swaggerSpec = swaggerJSDoc(options);
console.log(`✅ Generated Swagger spec with ${Object.keys(swaggerSpec.paths || {}).length} paths`);

// Ensure dist directory exists
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  console.log('📁 Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Write to dist directory
const distOutputPath = path.join(distDir, 'swagger.json');
fs.writeFileSync(distOutputPath, JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Swagger spec generated to:', distOutputPath);

// Also write to root for backup
const rootOutputPath = path.join(__dirname, '../swagger.json');
fs.writeFileSync(rootOutputPath, JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Backup swagger.json created in root:', rootOutputPath);

// Verify files were created
console.log('🔍 Verifying output files...');
console.log('   dist/swagger.json exists:', fs.existsSync(distOutputPath));
console.log('   root swagger.json exists:', fs.existsSync(rootOutputPath));

console.log('🎉 Swagger generation completed successfully!');