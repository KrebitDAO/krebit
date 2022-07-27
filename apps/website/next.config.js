const withTM = require('next-transpile-modules')([
  '@krebitdao/reputation-passport',
]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
});
