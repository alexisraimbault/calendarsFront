const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    react({
      html: {
        title: 'Team calendar'
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
