module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        // ECMAScript 版本
        "ecmaVersion":6,
        "sourceType":"script",//module
        // 想使用的额外的语言特性:
        "ecmaFeatures":  {
        // 允许在全局作用域下使用 return 语句
        "globalReturn":true,
        // impliedStric
        "impliedStrict":true,
        // 启用 JSX
        "jsx":true
        }
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};