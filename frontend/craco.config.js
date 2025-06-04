module.exports = {
    devServer: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin'
      },
      proxy: {
        '/api': {
          target: 'http://unpkg.com',
          changeOrigin: true,
          pathRewrite: { '^/cdn': '' },
        },
      },
    }
  };