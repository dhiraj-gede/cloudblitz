#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import process from 'process';


// Patterns that might indicate actual secrets
const SECRET_PATTERNS = [
  /sk_live_[a-zA-Z0-9]{24,}/, // Stripe live keys
  /rk_live_[a-zA-Z0-9]{24,}/, // Rave live keys
  /AKIA[0-9A-Z]{16}/, // AWS keys
  /sk-[a-zA-Z0-9]{48}/, // OpenAI keys
  /-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/, // Private keys
  /"password":\s*"[^"]{8,}"/, // Passwords in JSON
  /"secret":\s*"[^"]{8,}"/, // Secrets in JSON
];

// Files to exclude from secret checking
const EXCLUDED_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '*.test.ts',
  '*.spec.ts',
  '*.mock.ts',
  '.env.example',
  '.env.test',
];

// Safe patterns (common false positives)
const SAFE_PATTERNS = [
  /MONGODB_URI/, // Environment variable names
  /PORT/, // Common config
  /CORS_ORIGIN/, // Common config
  /localhost/, // Local development
  /127\.0\.0\.1/, // Localhost IP
  /mongodb:\/\//, // MongoDB URLs
  /test|dev|development/, // Test context
  /integrity:/, // package-lock.json integrity hashes
  /sha512-/, // package-lock.json hashes
  /[a-f0-9]{64}/, // SHA256 hashes (common in lock files)
];

// Get staged files
const stagedFiles = execSync('git diff --cached --name-only', {
  encoding: 'utf8',
})
  .split('\n')
  .filter(file => file.trim() && fs.existsSync(file));

let foundSecrets = false;

stagedFiles.forEach(file => {
  // Skip excluded files
  if (
    EXCLUDED_FILES.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(file);
      }
      return file === pattern || file.endsWith(pattern);
    })
  ) {
    console.log(`🔒 Skipping excluded file: ${file}`);
    return;
  }

  const content = fs.readFileSync(file, 'utf8');

  SECRET_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      // Check if it's a false positive
      const isFalsePositive = SAFE_PATTERNS.some(safePattern =>
        matches.some(match => safePattern.test(match))
      );

      if (!isFalsePositive) {
        console.log(`❌ Potential secret found in ${file}:`);
        console.log(
          `   Pattern ${index + 1}: ${matches[0].substring(0, 50)}...`
        );
        foundSecrets = true;
      }
    }
  });
});

if (foundSecrets) {
  console.log('\n❌ Potential secrets detected! Please review.');
  console.log(
    'If these are false positives, update Server/scripts/secret-check.js'
  );
  process.exit(1);
} else {
  console.log('✅ No secrets detected');
  process.exit(0);
}
