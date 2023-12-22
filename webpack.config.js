
const path = require("path");
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./bootstrap.js",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node_modules/",
            }
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bootstrap.js"
    },

    plugins: [
        new copyWebpackPlugin({
            patterns: [
                { from: "assets", to: "assets" },
                { from: "index.html", to: "./" }
            ]
        })
    ],
    mode: "development"
}