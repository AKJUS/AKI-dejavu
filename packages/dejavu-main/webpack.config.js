const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';

const plugins = (() => {
	const list = [
		// Ignore all locale files of moment.js (Webpack 5 options signature)
		new webpack.IgnorePlugin({
			resourceRegExp: /^\.\/locale$/,
			contextRegExp: /moment$/,
		}),
		new HtmlWebpackPlugin({
			template: './app/index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: './app/src/_redirects', to: '.' },
				{ from: 'chrome-specific', to: 'chrome-specific' },
				{ from: './app/src/samples', to: 'samples' },
			],
		}),
	];
	// Allow disabling favicons generation in environments where sharp/libvips is problematic
	if (process.env.DISABLE_FAVICONS !== '1') {
		list.push(
			new FaviconsWebpackPlugin({
				logo: './app/src/favicon/favicon.png',
				prefix: 'favicon/',
			}),
		);
	}
	return list;
})();

if (!isDevelopment) {
	plugins.push(
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:8].css',
			chunkFilename: '[name].[contenthash:8].css',
		}),
	);
	plugins.push(
		new CompressionPlugin({
			// ensure unique output names per asset to avoid conflicts
			filename: '[path][base].gz',
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8,
		}),
	);
	plugins.push(
		new CompressionPlugin({
			// ensure unique output names per asset to avoid conflicts
			filename: '[path][base].br',
			algorithm: 'brotliCompress',
			test: /\.(js|css|html|svg)$/,
			compressionOptions: {
				level: 11,
			},
			threshold: 10240,
			minRatio: 0.8,
		}),
	);
}

module.exports = {
	entry: [path.resolve(__dirname, 'app/src/index.js')],
	output: {
		path: path.resolve(__dirname, 'dist/app'),
		publicPath: '/',
		clean: true,
		filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
		chunkFilename: isDevelopment
			? '[name].bundle.js'
			: '[name].[contenthash:8].js',
	},
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		minimize: !isDevelopment,
		minimizer: ['...', new CssMinimizerPlugin()],
		splitChunks: {
			cacheGroups: {
				// Splitting React into a different bundle
				common: {
					test: /[\\/]node_modules[\\/](react|react-dom|antd)[\\/]/,
					name: 'common',
					chunks: 'all',
				},
			},
		},
	},
	plugins,
	devServer: {
		port: 1358,
		open: true,
		hot: true,
		historyApiFallback: true,
		static: {
			directory: path.resolve(__dirname, 'dist/app'),
			publicPath: '/',
			watch: true,
		},
		devMiddleware: {
			writeToDisk: true,
		},
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
				use: [
					isDevelopment
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg|woff|woff2|ttf|eot)$/i,
				type: 'asset/resource',
			},
		],
	},
};
