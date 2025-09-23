import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import markdown from 'eslint-plugin-markdown';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['src/**/*.{ts,js,mjs,cjs,mts,cts}'],
    ignores: ['dist/**', 'node_modules/**', '**/*.json', '**/*.jsonc', '**/*.md', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Separate config for test files
  {
    files: ['src/**/*.{test,spec}.{ts,js}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.jest },
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Test specific rules - more lenient
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    processor: 'markdown/markdown',
    rules: {
      // Markdown files
    },
  },
  // Global ignores for all configs
  {
    ignores: ['**/*.json', '**/*.jsonc', 'package*.json', 'tsconfig*.json', 'node_modules/**', 'dist/**'],
  }
);