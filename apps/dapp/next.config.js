const withTM = require('next-transpile-modules')([
  '@krebitdao/reputation-passport',
  '@krebitdao/eip712-vc'
]);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path: 'https://krebit.id/',
    formats: ['image/avif', 'image/webp'],
    domains: ['krebit.id', 'arweave.net']
  }
});
