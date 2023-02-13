const Dotenv = require("dotenv-webpack");

module.exports = {
  webpack: function override(config, env) {
    const plugins = [];
    const minimizer = [];
    plugins.push(new Dotenv({ ignoreStub: true }));
    if (env === "production") {
      const TerserPlugin = require("terser-webpack-plugin");
      minimizer.push(new TerserPlugin({}));
    }
    const newConfig = {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Translates CSS into CommonJS
              "css-loader",
              // Creates `style` nodes from JS strings
              "style-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
          },
        ],
      },
      optimization: {
        ...config.optimization,
        minimizer: [...config.optimization.minimizer, ...minimizer],
      },
      plugins: [...config.plugins, ...plugins],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@": config.resolve.alias.src,
        },
      },
    };
    return newConfig;
  },
};
