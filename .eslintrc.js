module.exports = {
    "extends": "eslint:recommended",  // eslint 使用那些规范
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "@babel/eslint-parser",
        ecmaVersion: 12,  // 解析器 解析代码时 ES的版本
        sourceType: 'module', // 指定源代码存在的位置
        allowImportExportEverywhere: true, // 不限制eslint对import使用位置
        ecmaFeatures: {
            modules: true,
            legacyDecorators: true
        }
    },
    // 使用全局变量
    "globals": {
        document: true,
        window: true,
        "process": true
    },
    "rules": {
        files: ["src/**/*.js"],  // 适用于 src 下的 js 文件
        ignores: ["**/*.config.js"],  // 忽略文件
        "semi": [2, "always"],//语句强制分号结尾
        'linebreak-style': [
            0,
            'error',
            'windows',
        ],
        "no-alert": 0,
        "no-console": process.env.NODE_ENV === 'production' ? 'error' : 'off',//禁止使用console
        "no-empty": 2,//块语句中的内容不能为空
        "no-extra-parens": 2,//禁止非必要的括号
        "no-irregular-whitespace": 2,//不能有不规则的空格
        "no-mixed-spaces-and-tabs": [2, false],//禁止混用tab和空格
        "no-multiple-empty-lines": [1, {"max": 2}],//空行最多不能超过2行
        "no-spaced-func": 2,//函数调用时 函数名与()之间不能有空格
        "no-trailing-spaces": 1,//一行结束后面不要有空格
        "no-undef": 1,//不能有未定义的变量
        "no-with": 2,//禁用with
        "complexity": [0, 5],//循环复杂度
        "max-depth": [0, 4],//嵌套块深度
        "max-params": [0, 5],//函数最多只能有3个参数
        "indent": [4],//缩进风格
    }
};