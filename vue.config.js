const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    /*host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    overlay:
    {
        errors: true,
        warnings: true
    },*/
    proxy: {
        '^/api': {
            target: [
                'http://localhost:3080',
                'http://54.156.157.168:80',
            ],
            changeOrigin: true
        },
    }
},
lintOnSave: process.env.NODE_ENV !== 'production' ? 'error' : false,
configureWebpack: {
  plugins: process.env.NODE_ENV === 'production' ? [
      // new ESLintPlugin({
      //     extensions: 'src/**/*.ts',
      // }),
      /*new WebpackObfuscator ({
              compact: true,
              controlFlowFlattening: false,
              controlFlowFlatteningThreshold: 0.05,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 1.0,
              debugProtection: false, // change to true
              debugProtectionInterval: false,
              disableConsoleOutput: false, // change to true
              identifierNamesGenerator: 'hexadecimal',
              log: false,
              numbersToExpressions: false,
              renameGlobals: false,
              rotateStringArray: true,
              selfDefending: true,
              shuffleStringArray: true,
              simplify: true,
              splitStrings: false,
              // splitStringsChunkLength: 10,
              stringArray: true,
              stringArrayEncoding: [],
              stringArrayWrappersCount: 1,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersType: 'variable',
              stringArrayThreshold: 0.75,
              // transformObjectKeys: true,
              unicodeEscapeSequence: false
      }, [])*/
  ] : [
          // new ESLintPlugin({
          //     extensions: 'src/**/*.ts',
          // })
      ],
}
});
