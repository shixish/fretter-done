var path = require('path');

module.exports = (env)=>{
  const DEVEL = env != 'prod';
  let config = {
    entry: {
      app: './src/index.jsx',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
      contentBase: './dist'
    },
    // postcss: () => {
    //   return [
    //     /* eslint-disable global-require */
    //     require('postcss-cssnext'),
    //     /* eslint-enable global-require */
    //   ];
    // },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react']
            }
          }
        },
        {
          test: /\.sss$/,
          use: [
            { loader: 'style-loader', options: { sourceMap: DEVEL } },
            { loader: 'css-loader', options: { sourceMap: DEVEL, importLoaders: true } },
            {
              loader: 'postcss-loader', options: {
                sourceMap: DEVEL,
                parser: 'sugarss'
              }
            }
          ]
        },
        {
          test: /node_modules.+\.css$/,
          use: [
            { loader: 'style-loader', options: { sourceMap: DEVEL } },
            { loader: 'css-loader', options: { sourceMap: DEVEL, importLoaders: true, modules: true } },
            { loader: 'postcss-loader', options: { sourceMap: DEVEL } }
            // { loader: 'sass-loader', options: { sourceMap: DEVEL } }
          ]
        },
        // {
        //   test: /\.css$/,
        //   loaders: [
        //     'style-loader',
        //     'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?sourceMap&sourceComments',
        //   ],
        // },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    }
  };

  if (DEVEL){
    Object.assign(config, {
      devtool: 'inline-source-map',
    });
  }
  return config;
};