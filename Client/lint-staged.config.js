// lint-staged.config.js
export default {
  '*.{ts,tsx,js,jsx}': ['eslint --fix --max-warnings 0', 'prettier --write'],
  '*.{json,css,md}': ['prettier --write'],
  'src/**/*.{ts,tsx}': [
    'bash -c \'echo "🔍 Running security checks..."\'',
    'npm audit --audit-level moderate',
    'bash -c \'echo "🧪 Running tests related to staged files..."\'',
    'npm test -- --findRelatedTests --passWithNoTests',
  ],
  // ✅ run type-check once at root, not per file
  '**/*': () => 'npm run type-check',
};
