const realConfig = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: ['prettier'],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowTypedFunctionExpressions: true }],
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '_' }],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'arrow-body-style': 'off',
    radix: 'off',
    'no-underscore-dangle': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'react/no-unescaped-entities': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'react/prop-types': 'off',
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
  },
}

const nopConfig = {
  /*

  This config is meant to do nothing.

  It exists because there's no good way to disable ESLint in Create React App:
  https://github.com/facebook/create-react-app/issues/9929

  So the workaround here is to craft a config that does as little as possible,
  and then conditionally use it.

  */

  ignorePatterns: ['**/*.ts', '**/*.tsx', './*.js', 'config/*.js'],
}

module.exports = process.env.DISABLE_ESLINT ? nopConfig : realConfig
