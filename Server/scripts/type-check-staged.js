import { execSync } from 'child_process';
import fs from 'fs';
import process from 'process';

// Check if we're being called with specific files (from lint-staged)
const hasFileArgs = process.argv.length > 2;

if (hasFileArgs) {
  // Create a temporary tsconfig that extends the main one but includes the specific files
  const mainTsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  const tempTsConfig = {
    ...mainTsConfig,
    files: process.argv.slice(2),
    include: [],
    exclude: []
  };
  
  fs.writeFileSync('tsconfig.temp.json', JSON.stringify(tempTsConfig, null, 2));
  
  try {
    execSync('tsc --project tsconfig.temp.json --noEmit', { stdio: 'inherit' });
  } finally {
    // Clean up temporary config
    if (fs.existsSync('tsconfig.temp.json')) {
      fs.unlinkSync('tsconfig.temp.json');
    }
  }
} else {
  // No files passed - check entire project
  execSync('tsc --project tsconfig.json --noEmit', { stdio: 'inherit' });
}