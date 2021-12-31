const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        'http://localhost:8086/',
        createProxyMiddleware(
            {
                        target: 'http://122.51.213.254:8086/',
                        changeOrigin: true
                    }
        )
    )
}