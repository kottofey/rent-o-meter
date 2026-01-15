// @ts-nocheck
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      'eslint.config.ts',
      '**/build/**',
      '**/dist/**',
      '**/node_modules/**',
      'src/express/bin/**/*',
      'src/express/app.ts',
      '_lint-backups/**',
      'src/express/**/*',
    ],
  },
  eslint.configs.recommended,

  {
    files: ['./src/**/*.ts', './src/**/*.js'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.typescript,
      importPlugin.flatConfigs.recommended,
    ],
    languageOptions: {
      sourceType: 'module',

      globals: {
        ...globals.node,
        ...globals.commonjs,
      },

      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: __dirname,
        // project: './tsconfig.json',
      },
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          extensions: ['.ts'],
          // project: './tsconfig.json',
        },
        node: {
          extensions: ['.ts'],
        },
      },
    },

    rules: {
      'import/order': [2, { 'newlines-between': 'always' }],
      'import/newline-after-import': [2, { count: 1, exactCount: true, considerComments: true }],
      // indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single'],
      'no-sync': 'warn',
      'no-alert': 'error',
      // 'no-console': 'error',
    },
  },
]);
