const path = require('path')

module.exports = {
    entry: ['./js/index.js'],
    output: {
        filename: "./bundle.js"
    },
    devtool: 'sourse-map',
    module:{
        rules:[
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'js/js'),
                use:{
                    loader: 'babel-loader',
                    options:{
                        presets: 'env'
                    }
                }
                
            }
        ]
    },
}