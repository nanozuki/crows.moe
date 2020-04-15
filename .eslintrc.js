module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "plugins": [
        "react"
    ],
    "rules": {
      'import/no-default-export': 'error',
      'import/prefer-default-export': 'off',
      'no-use-before-define': ['off', {}],
      'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }],
    },
    "ignorePatterns": ['dist', 'node_modules'],
    "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
        },
      },
    },
};
