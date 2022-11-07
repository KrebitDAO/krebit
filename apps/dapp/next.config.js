const withTM = require('next-transpile-modules')([
  '@krebitdao/reputation-passport',
  '@krebitdao/eip712-vc'
]);

module.exports = withTM({
  reactStrictMode: true,
  webpack: config => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  }
});
