import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.local',
      'coverage/',
      'vite.config.ts',
      'vitest.config.ts'
    ]
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', {
        args: 'after-used',
        argsIgnorePattern: '^_'
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-undef': 'error'
    }
  }
];
