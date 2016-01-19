module.exports = function (grunt) {

    grunt.config(['copy', 'cssFurniture'], {
        files: [{
            expand: true,
            cwd:    'source/scss/news_special/f/',
            src:    ['share_tools.png', 'bbc.png'],
            dest:   'content/<%= config.services.default %>/css/f'
        }]
    });

    grunt.config(['copy', 'requirejs'], {
        files: [{
            expand: true,
            cwd:    'source/js/lib/vendors/require/',
            src:    ['*.js'],
            dest:   'content/<%= config.services.default %>/js/lib/vendors/require/'
        }]
    });

    grunt.config(['copy', 'appmanager'], {
        files: [{
            expand: true,
            cwd:    'bower_components/appmanager/',
            src:    ['main.js'],
            dest:   'content/<%= config.services.default %>/js/',
            rename: function(dest, src) {
                return dest + src.replace('main.js', 'appmanager.js')
            }
        }]
    });

    grunt.config(['copy', 'jsAll'], {
        files: [{
            expand: true,
            cwd:    'source/js/',
            src:    ['**'],
            dest:   'content/<%= config.services.default %>/js/'
        }]
    });

};
