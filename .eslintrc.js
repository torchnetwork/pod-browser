module.exports = {
  env: {
    browser: true,
    es6: true,
  },

  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],

  // Set up es6 linting, and lint rules for react and jest
  plugins: [
    'babel',
    'react',
    'jest',
  ],

  // A few fixes for broken .eslint rules
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  parser: 'babel-eslint',

  // Load babel rules properly to handle es6
  parserOptions: {
    ecmaFeatureS: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },

  rules: {
    // next.js standard uses .js instead of .jsx for react
    'react/jsx-filename-extension': [1, { 'extensions': ['.tsx'] }],

    // next.js imports react by default via webpack config
    'react/react-in-jsx-scope': 0,

    'react/static-property-placement': [2, 'static public field'],

    // allow nextjs <Link> tags to contain the href, instead of the <a>
    'jsx-a11y/anchor-is-valid': ['error', {
      'components': ['Link'],
      'specialLink': ['hrefLeft', 'hrefRight'],
      'aspects': ['invalidHref', 'preferButton']
    }],

    // Make everything work with .ts and .tsx as well
    'import/extensions': [2, {
      js: 'never',
      ts: 'never',
      tsx: 'never',
    }],

    // Allow devDeps in test files
    'import/no-extraneous-dependencies': [0, {
      'devDependencies': ['**/*.test.ts', '**/*.test.tsx'],
    }],
  },
}
