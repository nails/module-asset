const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: {
        'ckeditor.config.basic': './assets/js/ckeditor.config.basic.js',
        'ckeditor.config.default': './assets/js/ckeditor.config.default.js',
        'nails.admin': './assets/js/nails.admin.js',
        'nails.admin.ckeditor': './assets/js/nails.admin.ckeditor.js',
        'nails.admin.export': './assets/js/nails.admin.export.js',
        'nails.admin.logs.site': './assets/js/nails.admin.logs.site.js',
        'nails.forms': './assets/js/nails.forms.js',
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'assets/js/')
    },
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].min.css'
        }),
    ],
    mode: 'production'
};
