const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'user-feat',
  exposes: {
    './Component': './apps/user-feat/src/app/app.component.ts',
    './routes': './apps/user-feat/src/app/modules/modules.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
}, {
  // Required when served under a gateway path like /mf/user/
  output: {
    publicPath: 'auto',
  },
});
