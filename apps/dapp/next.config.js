const withTM = require('next-transpile-modules')([
  '@krebitdao/reputation-passport',
  '@krebitdao/eip712-vc'
]);

module.exports = withTM({
  reactStrictMode: true
});
