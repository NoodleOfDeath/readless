const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const config = {
  resolver: {
    unstable_enablePackageExports: true,
    unstable_enableSymlinks: true,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
