const { execSync } = require('child_process');
const fs = require('fs');
const process = require('process');

// Check if we're being called with specific files (from lint-staged)
const hasFileArgs = process.argv.length > 2;

if (hasFileArgs) {
  // Create a temporary tsconfig that extends the main one but includes the specific files
  let mainTsConfig;
  try {
    mainTsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  } catch {
    console.error('Error: Failed to parse tsconfig.json. Ensure it is valid JSON (no comments allowed).');
    console.error(error.message);
    process.exit(1);
  }

  const tempTsConfig = {
    ...mainTsConfig,
    files: process.argv.slice(2),
    // Preserve include and typeRoots to ensure custom types are loaded
    include: mainTsConfig.include || [],
    compilerOptions: {
      ...mainTsConfig.compilerOptions,
      noEmit: true
    }
  };

  fs.writeFileSync('tsconfig.temp.json', JSON.stringify(tempTsConfig, null, 2));

  try {
    execSync('tsc --project tsconfig.temp.json --noEmit', { stdio: 'inherit' });
  } catch {
    console.error('TypeScript type-check failed for staged files.');
    process.exit(1);
  } finally {
    // Clean up temporary config
    if (fs.existsSync('tsconfig.temp.json')) {
      fs.unlinkSync('tsconfig.temp.json');
    }
  }
} else {
  // No files passed - check entire project
  try {
    execSync('tsc --project tsconfig.json --noEmit', { stdio: 'inherit' });
  } catch {
    console.error('TypeScript type-check failed for entire project.');
    process.exit(1);
  }
}