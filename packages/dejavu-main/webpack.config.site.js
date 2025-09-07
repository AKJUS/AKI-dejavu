const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { NODE_ENV } = process.env;

const plugins = (() => {
	const list = [
		// Ignore all locale files of moment.js (Webpack 5 options signature)
		new webpack.IgnorePlugin({
			resourceRegExp: /^\.\/locale$/,
			contextRegExp: /moment$/,
		}),
		new HtmlWebpackPlugin({
			template: './site/index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: './site/src/_redirects', to: '.' }],
		}),
	];
	if (process.env.DISABLE_FAVICONS !== '1') {
		list.push(
			new FaviconsWebpackPlugin({
				logo: './site/src/favicon/favicon.png',
				prefix: 'favicon/',
			}),
		);
	}
	return list;
})();

const isDevelopment = NODE_ENV === 'development';

module.exports = {
	entry: ['./site/src/index.js'],
	output: {
		path: path.resolve(__dirname, 'dist/site'),
		publicPath: '/',
		clean: true,
		filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
	},
	optimization: {
		splitChunks: { chunks: 'all' },
	},
	plugins,
	devServer: {
		port: 1359,
		open: true,
		hot: true,
		historyApiFallback: true,
		static: {
			directory: path.resolve(__dirname, 'dist/site'),
			publicPath: '/',
			watch: true,
		},
		devMiddleware: { writeToDisk: true },
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				type: 'asset/resource',
			},
		],
	},
};
