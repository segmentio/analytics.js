const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '/lib/index.js'),
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
        path: path.resolve(__dirname),
        filename: 'analytics.js'
    }
};
