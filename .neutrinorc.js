const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb(),
    react({
      html: {
        title: 'calendasFront'
      },
      style: {
        test: /\.(css|sass|scss)$/,
        moduleTest: /\.module\.(css|sass|scss)$/,
        loaders: [
          { loader: require.resolve('sass-loader'), useId: 'sass' },
        ]
      }
    }),
    jest(),
  ],
};
