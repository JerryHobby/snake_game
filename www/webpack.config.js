
const path = require("path");
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./bootstrap.js",
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