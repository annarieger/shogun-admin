const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
let commonWebpackConfig = commonConfig;

const delayedConf = new Promise(function(resolve) {
  commonWebpackConfig.plugins = [
    ...commonWebpackConfig.plugins || [],
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin({ profile: false }),
    new webpack.DefinePlugin({
      APP_MODE: JSON.stringify(commonConfig.TARGET)
    })
  ];

  const proxyCommonConf = {
    changeOrigin: false,
    cookieDomainRewrite: 'localhost',
    cookiePathRewrite: '/',
    secure: false,
    onProxyRes: (proxyRes) => {
      if ([301, 302, 307, 308].indexOf(proxyRes.statusCode) > -1 && proxyRes.headers.location) {
        let redirect = proxyRes.headers.location;
        console.log('Received code ' + proxyRes.statusCode + ' from API Server for URL - ' + redirect);
        redirect = redirect.replace('http://', 'https://');
        console.log('Manipulating header location and redirecting to - ' + redirect);
        proxyRes.headers.location = redirect;
      }
    }
  };

  commonWebpackConfig.devServer = {
    historyApiFallback: true,
    contentBase: '.',
    useLocalIp: false,
    disableHostCheck: true,
    host: '0.0.0.0',
    https: false,
    inline: true,
    port: 9090,
    publicPath: 'http://localhost:9090/',
    // https://github.com/chimurai/http-proxy-middleware#context-matching
    // Note: In multiple path matching, you cannot use string paths and
    //       wildcard paths together!
    proxy: [{
      ...proxyCommonConf,
      context: [
        '/auth/**',
        '/users/**',
        '/addresses/**',
        '/employees/**',
        '/facilities/**',
        '/files/**',
        '/locationcosts/**',
        '/organizations/**',
        '/projects/**',
        '/shifts/**',
        '/shiftconditions/**',
        '/transportations/**',
        '/transportationtemplates/**',
        '/transportationtraits/**',
        '/transportationproperties/**',
        '/client-config.*',
        '/sso/**'
      ],
      target: 'http://localhost:8082/'
    }, {
      ...proxyCommonConf,
      context: [
        '/info',
        '/users',
        '/addresses',
        '/employees',
        '/facilities',
        '/files',
        '/locationcosts',
        '/organizations',
        '/projects',
        '/shifts',
        '/shiftconditions',
        '/transportations',
        '/transportationtemplates',
        '/transportationtraits',
        '/transportationproperties',
        '/graphql',
        '/sso'
      ],
      target: 'http://localhost:8082/'
    }]
  };

  resolve(commonWebpackConfig);
});

module.exports = new Promise((resolve) => {
  delayedConf.then((conf) => {
    resolve(conf);
  });
});
