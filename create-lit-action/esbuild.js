const { build, analyzeMetafile } = require('esbuild');
const {
  NodeGlobalsPolyfillPlugin
} = require('@esbuild-plugins/node-globals-polyfill');
const {
  NodeModulesPolyfillPlugin
} = require('@esbuild-plugins/node-modules-polyfill');

const go = async () => {
  let result = await build({
    entryPoints: ['./toBundle.js'],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: './bundled.js',
    sourceRoot: './',
    platform: 'node',
    metafile: true
  });
  // let text = await analyzeMetafile(result.metafile);
  // console.log(text);
};

go();
