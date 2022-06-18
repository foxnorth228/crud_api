const path = require("path");

module.exports = {
    target: "node",
    entry: "./src/server.ts",
    output : {
        path: path.resolve(__dirname, "prod"),
        filename: "bundle.cjs"
    },
    module: {
        rules: [
            {test: /\.ts$/, use: "ts-loader"}
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
    mode: "production",
    resolve: {
        fallback: {
            "fs": false,
            "os": false,
            "path": false,
            "http": false
        },
    }
}