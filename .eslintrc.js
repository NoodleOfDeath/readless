module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended', 'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: [
        '*.md',
      ],
      processor: 'markdown/markdown',
      rules: {
        'no-undef': 'off',
        // Add any other rules you want to disable for Markdown files
      },
    },
    {
      // 3. Optionally, customize the configuration ESLint uses for ```js
      // fenced code blocks inside .md files.
      files: [
        '**/*.md/*.js',
      ],
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'markdown',
    '@typescript-eslint',
    'import',
    'import-newlines',
    'sort-keys-fix',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn', // or "error"
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/semi': [
      'error', 'always',
    ],
    '@typescript-eslint/sort-type-constituents': 'error',
    'array-bracket-newline': [
      'error', 'consistent',
    ],
    'array-element-newline': [
      'error', 'consistent',
    ],
    'brace-style': [
      'error', '1tbs',
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'comma-spacing': [
      'error',
    ],
    curly: [
      'error',
    ],
    'function-call-argument-newline': [
      'error', 'consistent',
    ],
    'function-paren-newline': [
      'error', 'multiline-arguments',
    ],
    'import-newlines/enforce': [
      'error',
      {
        items: 2,
        'max-len': 100,
        semi: true,
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: false,
          order: 'asc',
        },
        groups: [
          'builtin',
          'external',
          'internal',
          [
            'parent', 'sibling',
          ],
          'index',
        ],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'external',
            pattern: 'react+(|-native)',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: [
          'react',
        ],
      },
    ],
    indent: [
      'error', 2,
    ],
    'keyword-spacing': [
      'error',
    ],
    'linebreak-style': [
      'error', 'unix',
    ],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          ImportDeclaration: true,
          Property: true,
          VariableDecorator: true,
        },
      },
    ],
    'no-multiple-empty-lines': [
      'error', { max: 1, maxEOF: 1 },
    ],
    'no-unused-vars': 'off',
    'no-useless-rename': 'error',
    'object-curly-newline': [
      'error',
      {
        ExportDeclaration: {
          minProperties: 3,
          multiline: true,
        },
        ImportDeclaration: {
          minProperties: 3,
          multiline: true,
        },
        ObjectExpression: {
          minProperties: 3,
          multiline: true,
        },
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
        },
      },
    ],
    'object-curly-spacing': [
      'error', 'always',
    ],
    'object-shorthand': [
      'error', 'always',
    ],
    'padded-blocks': [
      'error', { classes: 'always' },
    ],
    quotes: [
      'error', 'single',
    ],
    semi: 'off',
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      },
    ],
    'sort-keys-fix/sort-keys-fix': 'error',
  },
};
