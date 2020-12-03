const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = 
{
	entry: "./src/main.js",

	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "./dist"),
		publicPath: ""
	},
	mode: "development",
	devServer:{
		contentBase: path.resolve(__dirname, "./dist"),
		index: "index.html",
		port: 9000
	},
	module:
	{
		rules:[
			{
				test: /\.(png|webp|jpg|gif)$/,
				use:[
					'file-loader'
				]
			},
			{
				test: /\.css$/,
				use:[
					MiniCssExtractPlugin.loader,
					'css-loader',
				]
			},
			{
				test: /\.scss$/,
				use:[
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				]
			},
			{
				test: /\.js$/,
				exclude: "/node_modules/",
				use:{
					loader: 'babel-loader',
					options:{
						plugins: [
							"@babel/plugin-proposal-class-properties",
							"@babel/plugin-proposal-private-methods",
						]
					}
				}
			},
			{
				test: /\.hbs$/,
				use: [
					'handlebars-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css"
		}),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: "index.html",
			title: "Coloring Book",
			description: "Coloring book",
			template: "src/index.hbs"
		}),
	]
}
