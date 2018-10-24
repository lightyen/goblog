import * as webpackMerge from "webpack-merge"
import baseWebpackConfig from "./webpack.config"

export default webpackMerge(baseWebpackConfig, {
    performance: {
        hints: "warning",
    },
    mode: "production",
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: "all",
            // minSize: 30000,
            // minChunks: 1,
            // maxAsyncRequests: 5,
            // maxInitialRequests: 3,
            // name: true,
            // cacheGroups: {
            //     "vendors": {
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -10,
            //     },
            //     "default": {
            //         minChunks: 2,
            //         priority: -20,
            //         reuseExistingChunk: true,
            //     },
            //     "react-vendor": {
            //         test: (module, chunks) => /react/.test(module.context),
            //         priority: 5,
            //     },
            //     "antd-vendor": {
            //         test: (module, chunks) => /antd/.test(module.context),
            //         priority: 1,
            //     },
            // },
        },
    },
})
