const withTM = require('next-transpile-modules')(['lib']);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
});
