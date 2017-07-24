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