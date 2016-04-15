var CLIENT_NAME = 'TPCTrainco';

module.exports = function() {
    var ROOT = './';
    var TMP_DIR = './.tmp/';
    var UMBRACO = './src/' + CLIENT_NAME + '.Umbraco/';
    var ASSETS_BASE = UMBRACO + 'assets/';
    var IMG_DIR = ASSETS_BASE + 'images/';
    var JS_DIR = ASSETS_BASE + 'js/';
    var SASS_DIR = './src/sass/';
    var CSS_DIR = ASSETS_BASE + 'css/'
    var NGAPP = JS_DIR + 'ngapp/';
    var DOCS = './docs/';
    var TESTS = './__tests__/';
    var NODE_MODULES = 'node_modules';

    var config = {
        /**
         * File paths
         */
        alljs: [
            JS_DIR + '**/*.js',
            './*.js'
        ],
        build: './build/',
        client: UMBRACO,
        css: CSS_DIR,
        razor: UMBRACO + 'views/**/*.cshtml',
        ngtemplates: NGAPP + '**/*.html',
        images: IMG_DIR + '**/*.*',

        ngjs: [
            NGAPP + '**/*.module.js',
            NGAPP + '**/*.js',
            '!' + NGAPP + '**/*.spec.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        sass: SASS_DIR,
        docs: DOCS,
        root: ROOT,
        source: 'src/',
        tmp: TMP_DIR,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standAlone: false
            }
        },

        /**
         * NPM files
         */
        packages: [
            './package.json'
        ],
        string: 'env',
        default: {
          env: process.env.NODE_ENV || 'dev'
        }
    };

    return config;

    ////////////////

};
