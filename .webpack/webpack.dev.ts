
import { HotModuleReplacementPlugin, NamedChunksPlugin, NamedModulesPlugin } from "webpack"
import * as webpackMerge from "webpack-merge"
import baseWebpackConfig from "./webpack.config"

export default webpackMerge(baseWebpackConfig, {
    performance: {
        hints: "warning",
    },
    mode: "development",
    devtool: "source-map",
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: ["renderer/**/*.js", "node_modules"],
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new NamedModulesPlugin(),
        new NamedChunksPlugin(),
    ],
})
