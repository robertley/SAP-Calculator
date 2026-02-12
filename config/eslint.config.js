const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const ngPlugin = require('@angular-eslint/eslint-plugin');
const ngTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const ngTemplateParser = require('@angular-eslint/template-parser');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'simulation/dist/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': ngPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...ngPlugin.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/no-output-native': 'off',
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: ngTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': ngTemplatePlugin,
    },
    rules: {},
  },
];
