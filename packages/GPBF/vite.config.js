// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')


module.exports = defineConfig({
  build: {
    emptyOutDir:false,
    lib: {
      entry: path.resolve(__dirname, 'src/mapsrcGPBF.ts'),
      name: 'mapsrcGPBF',
      fileName: (format) => `mapsrcGPBF.${format}.js`
    }
  }
})
