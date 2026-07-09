const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'angular3',
  exposes: {
    './web-components': './src/bootstrap.ts',
  },
  shared: {
    ...shareAll({ singleton: false, strictVersion: false, requiredVersion: 'auto' }),
  },
}, {
  // Required when served under a gateway path like /mf/order/
  output: {
    publicPath: 'auto',
  },
});
