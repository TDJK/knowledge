const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');

// const CompressionWebpackPlugin = require('compression-webpack-plugin');
const {
    defineConfig
} = require('@vue/cli-service');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './', // 基本路径
    outputDir: 'dist', // 输出文件目录
    lintOnSave: false, // eslint-loader 是否在保存的时候检查
    assetsDir: 'static', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    pages: undefined, // 以多页模式构建应用程序。
    runtimeCompiler: false, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
    // webpack配置
    // 对内部的 webpack 配置进行更细粒度的修改
    chainWebpack: (config) => {
        //修改文件引入自定义路径
        config.resolve.alias.set('@', resolve('src'));
    },
    //调整 webpack 配置
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production';
            // 利用splitChunks将每个依赖包单独打包，在生产环境下配置
            // 开启gzip压缩
            // config.plugins.push(
            //     new CompressionWebpackPlugin({
            //         algorithm: 'gzip',
            //         test: /\.ts$|\.html$|\.json$|\.css/,
            //         threshold: 10240,
            //         minRatio: 0.8,
            //     })
            // );
            // 开启分离js
            config.optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 20000, // 依赖包超过20000bit将被单独打包
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(
                                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                                )[1];
                                // npm package names are URL-safe, but some servers don't like @ symbols
                                return `${packageName.replace('@', '')}`;
                            },
                        },
                    },
                },
                minimizer: [
                    new TerserWebpackPlugin({
                        terserOptions: {
                            output: {
                                comments: false, // 去除注释
                            },
                            warnings: false, // 去除黄色警告,
                            compress: {
                                drop_console: true,
                                drop_debugger: true, // 特定情况需要利用debugger防止调试
                                pure_funcs: ['console.log'], // 移除console.log 避免console.error
                            }
                        },
                    }),
                ],
            };
            // 取消webpack警告的性能提示
            config.performance = {
                hints: 'warning',
                //入口起点的最大体积
                maxEntrypointSize: 50000000,
                //生成文件的最大体积
                maxAssetSize: 30000000,
                //只给出 ts 文件的性能提示
                assetFilter: function (assetFilename) {
                    return assetFilename.endsWith('.ts');
                },
            };
        } else {
            // 为开发环境修改配置...
            config.mode = 'development';

            config.optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 20000, // 依赖包超过20000bit将被单独打包
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(
                                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                                )[1];
                                // npm package names are URL-safe, but some servers don't like @ symbols
                                return `${packageName.replace('@', '')}`;
                            },
                        },
                    },
                },
            };
        }
    },
    css: {
        // 启用 CSS modules
        // requireModuleExtension: false,
        // 是否使用css分离插件
        extract: true,
        // 开启 CSS source maps，一般不建议开启
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            less: {
                modifyVars: {},
                javascriptEnabled: true,
            }
        }
    },
    pwa: {}, // PWA 插件相关配置
    // webpack-dev-server
    devServer: {
        // host: 'localhost',
        // host: '192.168.137.1',
        port: 8000, // 端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        hot: true, // 热更新
        // proxy: 'http://localhost:8000'
        proxy: {
            //配置自动启动浏览器
            '/api': {
                target: 'http://47.111.184.60:30085',
                changeOrigin: true,
                // ws: true,//websocket支持
                secure: false,
                // ws: true,
                // pathRewrite: {
                //     '^/api': ''
                // }

            },
        },
    },
    // 第三方插件配置
    pluginOptions: {},
});