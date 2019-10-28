const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, '/lib'),
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [new CompressionPlugin()],
    output: {
        library: 'analytics',
        libraryTarget: 'umd',
        filename: 'analytics.min.js'
    }
};
