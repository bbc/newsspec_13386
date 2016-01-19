module.exports = function (grunt) {

    grunt.registerTask('css', ['clean:sasscache', 'sass:main', 'sass:inline', 'csslint', 'cssmin']);

    grunt.config(['clean', 'sasscache'], {
        src:  ['./.sass-cache']
    });

    grunt.config('sass', {
        main: {
            files: {
                './content/<%= config.services.default %>/css/main.css':      './source/scss/main.scss',
                './content/<%= config.services.default %>/css/legacy-ie.css': './source/scss/legacy-ie.scss',
            }
        },
        inline: {
            options: {
                'sourcemap=none': ''
            },
            files: {
                './source/scss/news_special/inline.min.css': './source/scss/news_special/inline.scss'
            }
        }
    });

    grunt.config('csslint', {
        options: {
            'known-properties'              : false,
            'box-sizing'                    : false,
            'box-model'                     : false,
            'compatible-vendor-prefixes'    : false,
            'regex-selectors'               : false,
            'duplicate-background-images'   : false,
            'gradients'                     : false,
            'fallback-colors'               : false,
            'font-sizes'                    : false,
            'font-faces'                    : false,
            'floats'                        : false,
            'star-property-hack'            : false,
            'outline-none'                  : false,
            'import'                        : false,
            'underscore-property-hack'      : false,
            'rules-count'                   : false,
            'qualified-headings'            : false,
            'shorthand'                     : false,
            'text-indent'                   : false,
            'unique-headings'               : false,
            'unqualified-attributes'        : false,
            'vendor-prefix'                 : false,
            'universal-selector'            : false,
            'force'                         : true
        },
        src: ['./content/<%= config.services.default %>/css/main.css']
    });

    grunt.config('cssmin', {
        minify: {
            expand: true,
            cwd: 'content/<%= config.services.default %>/css/',
            src: ['*.css'],
            dest: 'content/<%= config.services.default %>/css/'
        }
    });
};