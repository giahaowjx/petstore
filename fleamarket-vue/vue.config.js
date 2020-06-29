module.exports = {
    assetsDir: 'assets',
    lintOnSave: false,
    devServer: {
        open: true,
        host: "localhost",
        port: '8081',
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'http://market.yuxinzhao.top:9000/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
