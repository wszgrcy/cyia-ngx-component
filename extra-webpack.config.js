module.exports = (webpackConfig, cliConfig) => {
    if (cliConfig.buildOptimizer) {
        // console.log('测试');
        // https://github.com/angular/angular-cli/issues/14033
        // console.log(webpackConfig.module);
        // webpackConfig.module.rules.forEach((e) => {
        //     console.log(e.use && e.use.map((item) => item.loader).join('|'));
        // })
        const loaders = webpackConfig.module.rules
            .filter(rule => rule.use && rule.use
                .find(it => it.loader && it.loader.includes('@angular-devkit\\build-optimizer')));
        // console.log('需要修改的', loaders);
        loaders.forEach((loader) => {
            const originalTest = loader.test;
            loader.test = (file) => {
                // console.log(file);
                const isMonaco = !!file.match('monaco-editor');
                // if (file&&file.includes('monaco-editor')) {
                //     console.log('匹配成功', file);
                //     console.log(file.match('node_modules\\monaco-editor'));
                //     console.log(file.match('monaco-editor'));
                // }
                return !isMonaco && !!file.match(originalTest);
            };

        })
    }
    return webpackConfig;
};