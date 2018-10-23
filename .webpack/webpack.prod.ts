import * as webpackMerge from "webpack-merge"
import baseWebpackConfig from "./webpack.config"

export default webpackMerge(baseWebpackConfig, {
    performance: {
        hints: "warning",
    },
    mode: "production",
    optimization: {
        minimize: true,
        // splitChunks: {
        //     chunks: "all",
        // },
    },
})
