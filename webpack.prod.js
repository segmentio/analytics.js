const path = require('path');

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
    output: {
        library: 'analytics',
        libraryTarget: 'umd',
        filename: 'analytics.min.js'
    }
};
