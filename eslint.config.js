import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'prefer-const': 'error',
      'require-await': 'error',
      'no-console': 'off',
    },
  },

  {
    files: ['__tests__/**/*.js'],
    languageOptions: {
      // Define variables globales de Jest
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },

  {
    plugins: {
      prettier: prettierPlugin,
      '@stylistic': stylistic,
    },
    rules: {
      'prettier/prettier': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
  prettierConfig,
];
