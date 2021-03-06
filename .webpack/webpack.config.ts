import { Configuration, Entry } from "webpack"
import * as path from "path"
import * as fs from "fs"
import { TsConfigPathsPlugin } from "awesome-typescript-loader"
import * as EventHooksPlugin from "event-hooks-webpack-plugin"
import * as shell from "shelljs"
const TsImportPlugin = require("ts-import-plugin")
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import * as MiniCssExtractPlugin from "mini-css-extract-plugin"
// var nodeExternals = require('webpack-node-externals')

const entry: Entry = {
    index:  "./renderer/index.tsx",
    404:  "./renderer/NotFound.tsx",
}

const titles = {
    index: "goblog",
    404: "Not Found",
}

const distPath = path.resolve(__dirname, "../web")
const rendererPath = path.resolve(__dirname, "../renderer")

const conf: Configuration = {
    entry,
    output: {
        filename: "[name].[hash].js",
        path: distPath,
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "tsconfig.json",
                    silent: true,
                    getCustomTransformers: () => ({
                        before: [TsImportPlugin([
                            {
                              libraryName: "antd",
                              libraryDirectory: "lib",
                              style: true,
                            },
                            {
                              libraryName: "material-ui",
                              libraryDirectory: "",
                              camel2DashComponentName: false,
                            },
                          ])],
                    }),
                    // useBabel: false,
                    // babelOptions: {
                    //     babelrc: false, /* Important line */
                    //     presets: [
                    //         ["@babel/preset-env", { "targets": "last 2 versions, ie 11", "modules": false }]
                    //     ]
                    // },
                    // "babelCore": "@babel/core",
                },
                include: [path.resolve(__dirname, "../renderer")],
            },
            {
                test: /\.(png|jp(e?)g|gif|svg)$/,
                use: [
                    { loader: "file-loader", options: { name: "assets/images/[name].[ext]" }},
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
                use : [
                    { loader: "file-loader", options: {name: "assets/fonts/[name].[ext]?[hash]"} },
                    { loader: "url-loader",  query:   {name: "assets/fonts/[name].[ext]"} },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader"},
                    { loader: "postcss-loader", options: { config: { path: ".config/" } } },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader" },
                    // { loader: "typings-for-css-modules-loader",
                    //   options: {
                    //         modules: true,
                    //         namedExport: true,
                    //         camelCase: true,
                    //         minimize: true,
                    //         importLoaders: 1,
                    //         localIdentName: "[local]-[hash]",
                    //     },
                    // },
                    { loader: "less-loader", options: { javascriptEnabled: true } },
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "typings-for-css-modules-loader",
                      options: {
                          modules: true,
                          namedExport: true,
                          camelCase: true,
                          minimize: true,
                          localIdentName: "[local]-[hash]",
                      },
                    },
                    { loader: "postcss-loader", options: { config: { path: ".config/" } } },
                    { loader: "sass-loader" },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        plugins: [
            new TsConfigPathsPlugin({
                configFile: "tsconfig.json",
            }),
        ],
    },
    plugins: [
        new EventHooksPlugin({
            beforeRun: () => {
                shell.rm("-rf", distPath)
            },
            done: () => {
                // shell.cp("-rf",
                //     join(rendererPath, "assets/", "locales/"),
                //     join(distPath, "assets/"))
            },
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css",
        }),
    ].concat(Object.keys(entry).map((name: string) => {
        const exclude = Object.keys(entry).slice()
        exclude.splice(Object.keys(entry).indexOf(name), 1)
        return new HtmlWebpackPlugin({
            filename: name + ".html",
            excludeChunks: exclude,
            template: path.join("renderer", "public", name + ".ejs"),
            inject: "body",
            favicon: path.join("renderer", "assets", "images", "favicon.ico"),
            title: titles[name],
        })
    })),
}

export default conf
