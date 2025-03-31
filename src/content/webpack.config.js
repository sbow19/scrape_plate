import path from 'path'

export default {
  entry: './src/main.ts', // Entry point for the service worker
  output: {
    filename: 'content_script.js',  // Output bundled JavaScript file for the service worker
    path: path.resolve(process.cwd(), '../../public/content'),
  },
  target: 'web',
  resolve: {
    modules: [process.cwd(), "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  node: {
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,  // Ignore TypeScript errors during bundling
            },
          },
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',  // Set to 'production' for a production build
};
