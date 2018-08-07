var path = require('path');

export default () => (
    {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'ctjs-fetch.js',
            libraryTarget: 'umd',
            library: 'ctjs-fetch'
        },
        externals: {
            'bluebird': {
                commonjs: 'bluebird',
                commonjs2: 'bluebird',
                amd: 'bluebird',
                root: 'bluebird'
            }
        },
        module: {
            rules: [
                {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
            ]
        },
    }
);