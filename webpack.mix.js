const mix = require('laravel-mix')
const path = require('path')

const sassOptions = {
  outputStyle: 'expanded',
  includePaths: [path.join(__dirname, './node_modules')]
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */
mix.setPublicPath('public/dist')

mix.webpackConfig({
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.svg$/i,
        use: 'raw-loader'
      },

      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      }

    ]
  },
  resolve: {
    alias: {
      components: path.join(__dirname, 'assets/js/lib/components'),
      objects: path.join(__dirname, 'assets/js/lib/objects'),
      modules: path.join(__dirname, 'assets/js/lib/modules'),
      vendor: path.join(__dirname, 'assets/js/lib/vendor'),
      core: path.join(__dirname, 'assets/js/'),
      data: path.join(__dirname, 'assets/js/lib/data')
    },
    symlinks: false,
    modules: ['node_modules']
  }
})

mix.js('assets/js/app.js', 'public/dist/js/app.min.js')
  .sass('assets/sass/screen.scss', 'public/dist/css/screen.min.css', sassOptions).options({ processCssUrls: false })
  .sourceMaps()
  .browserSync({
    server: {
      baseDir: 'public'
    },
    proxy: false,
    files: [
      path.join(__dirname, 'public/dist/js/*.js'),
      path.join(__dirname, 'public/dist/css/*.css')
    ]
  })
