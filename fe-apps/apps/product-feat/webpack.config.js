const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'product-feat',
  exposes: {
    './routes': './apps/product-feat/src/app/modules/modules.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
}, {
  // Required when served under a gateway path like /mf/product/
  output: {
    publicPath: 'auto',
  },
});
