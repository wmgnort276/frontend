/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:vue/vue3-strongly-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 2019
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 2
      }
    ],
    'no-multi-spaces': 2,
    'vue/no-parsing-error': 1,
    'prettier/prettier': 'error',
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: ['a(-\\w+)+', 'router-link', 'router-view']
      }
    ],
    'vue/no-unused-vars': [
      'error',
      {
        ignorePattern: '^_'
      }
    ]
  }
};
