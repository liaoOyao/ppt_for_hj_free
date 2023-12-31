// https://eslint.org/docs/rules/

// const isProduction = process.env.NODE_ENV === 'production'
const isProduction = process.env.NODE_ENV === 'production'


module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'curly': ['error', 'multi-line'],
    'eqeqeq': ['error', 'always'],
    // 'eqeqeq': ['error', 'always'],
    'semi': ['error', 'never'],
    'indent':'off',
    // 'indent': ['error', 2, { 
    //   'SwitchCase': 1,
    // }],
    'quotes': "off",
    // 'quotes': ['error', 'single', {
    //   'avoidEscape': true,
    //   'allowTemplateLiterals': true,
    // }],
    "key-spacing": "off",
    // 'key-spacing': ['warn', {
    //   'beforeColon': false,
    //   'afterColon': true,
    //   'mode': 'strict',
    // }],
    // 'no-empty': 'error',
    'no-empty': 'off',
    "@typescript-eslint/no-empty-function": "off",
    'no-else-return': 'error',
    'no-else-return': 'off',
    'no-multi-spaces': 'warn',
    // 'no-multi-spaces': 'error',
    'require-await': 'error',
    'brace-style':'off',
    // 'brace-style': ['error', 'stroustrup'],
    'spaced-comment': 'off',
    // 'spaced-comment': ['error', 'always'],
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    "comma-spacing": "off",
    // 'comma-spacing': ['error', {
    //   'before': false,
    //   'after': true,
    // }],
    'default-case': 'error',
    'consistent-this': ['error', '_this'],
    'max-depth': ['error', 7],
    // 'max-lines': ['error', 800],
    'max-lines': 'off',
    'no-multi-str': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': 'off',
    // 'space-before-function-paren': ['error', {
    //   'named': 'never',
    //   'anonymous': 'never',
    //   'asyncArrow': 'always',
    // }],
    'keyword-spacing': ['error'],
    'prefer-const': 'error',
    'no-useless-return': 'error',
    'array-bracket-spacing': 'error',
    'no-useless-escape': 'off',
    'no-eval': 'error',
    'no-var': 'error',
    'no-with': 'error',
    // 'no-alert': isProduction ? 'error' : 'warn',
    // 'no-console': isProduction ? 'error' : 'warn',
    'no-alert': isProduction ? 'error' : 'warn',
    'no-console': isProduction ? 'error' : 'error',
    // 'no-': isProduction ? 'error' : 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unreachable': 'off',
    "no-undef": "off",
    "no-debugger": isProduction ? 'error' : 'warn'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true,
      },
    },
  ],
}
