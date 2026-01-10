import js from '@eslint/js';
import globals from 'globals';
import {
  configs as tseslintConfigs,
  parser as tseslintParser,
} from 'typescript-eslint';
import vuePlugin from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import steigerPlugin from '@feature-sliced/steiger-plugin';
import tanstackPluginQuery from '@tanstack/eslint-plugin-query'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: {
      js,
      steigerPlugin,
    },
    extends: ['js/recommended'],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          projectService: true,
          // project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/order': [2, { 'newlines-between': 'always' }],
      'import/newline-after-import': [
        2,
        { count: 1, exactCount: true, considerComments: true },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: { globals: globals.browser },
  },
  ...tanstackPluginQuery.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  tseslintConfigs.recommended,
  vuePlugin.configs['flat/essential'],
  // [...featureSlicedConfig],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslintParser,
      },
    },
  },
]);
