module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Adjust the target to match your server's URL
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};