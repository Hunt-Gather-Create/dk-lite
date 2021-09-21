const { build } = require('esbuild')

build({
  entryPoints: ['index.js'],
  outfile: './public/index.js',
  bundle: true,
  minify: true,
})
  .then(() => console.log('Building app...'))
  .catch(() => process.exit(1))
