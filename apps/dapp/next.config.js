const withTM = require('next-transpile-modules')([
  '@krebitdao/reputation-passport',
  '@krebitdao/eip712-vc'
]);

module.exports = withTM({
  reactStrictMode: true,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };

    return config;
  }
});
