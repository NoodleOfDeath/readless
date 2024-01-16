module.exports = {
  assumptions: { arrayLikeIsIterable: true },
  plugins: [
    [
      'module:react-native-dotenv',
      {
        allowUndefined: true,
        allowlist: null,
        blocklist: null,
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: false,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        alias: { '~': './src' },
        root: [
          './',
        ],
      },
    ],
    ['@babel/plugin-proposal-object-rest-spread'],
    'react-native-reanimated/plugin',
  ],
  presets: [
    ['@babel/preset-env'], 
    ['@babel/preset-react'],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        allowNamespaces: true,
        isTSX: true,
        jsxPragma: 'React',
        onlyRemoveTypeImports: true,
      },
    ],
  ],
};