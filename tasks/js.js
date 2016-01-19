/*
 *module.exports = function (grunt) {
 *
 *    grunt.registerTask('copy_js_minimum', ['copy:requirejs']);
 *
 *    grunt.config(['copy', 'requirejs'], {
 *        files: [{
 *            expand: true,
 *            cwd:    'source/js/lib/vendors/require/',
 *            src:    ['*.js'],
 *            dest:   'content/<%= config.services.default %>/js/lib/vendors/require/'
 *        }]
 *    });
 *
 *    grunt.config(['copy', 'jsAll'], {
 *        files: [{
 *            expand: true,
 *            cwd:    'source/js/',
 *            src:    ['**'],
 *            dest:   'content/<%= config.services.default %>/js/'
 *        }]
 *    });
 *
 *    grunt.registerTask('copyRequiredJs', function () {
 *        if (grunt.config.get('config').debug === 'true') {
 *            grunt.task.run('copy:jsAll');
 *        } else {
 *            grunt.task.run('copy_js_minimum');
 *        }
 *    });
 *
 *    var applicationJS = ['requirejs:jquery1', 'requirejs:jquery2'];
 *    if (grunt.config.get('config').scaffoldLite === 'true') {
 *        applicationJS = ['requirejs:lite'];
 *    }
 *
 *    grunt.config(['concurrent', 'js'], {
 *        tasks: ['jshint'].concat(applicationJS)
 *    });
 *    grunt.registerTask('js', ['clean:allJs', 'overrideImagerImageSizes', 'concurrent:js', 'copyRequiredJs']);
 *};
 */


module.exports = function (grunt) {

    grunt.registerTask('js', ['overrideImagerImageSizes', 'concurrent:js', 'copyRequiredJs', 'copy:requirejs']);

    var debugMode    = (grunt.config.get('config').debug === 'true'),
        scaffoldLite = (grunt.config.get('config').scaffoldLite === 'true');


    grunt.config(['copy', 'requirejs'], {
        files: [{
            expand: true,
            cwd:    'source/js/lib/vendors/require/',
            src:    ['js'],
            dest:   'content/<%= config.services.default %>/js/lib/vendors/require/'
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

    grunt.registerTask('copyRequiredJs', function () {
        if (grunt.config.get('config').debug === 'true') {
            grunt.task.run('copy:jsAll');
        } else {
            grunt.task.run('copy_js_minimum');
        }
    });

    grunt.config(['concurrent', 'js'], {
        tasks: (function getListOfConcurrentTasks() {

            var applicationJS = ['jshint'];

            if (scaffoldLite) {
                applicationJS.push('requirejs:lite');
            }
            else if (!debugMode) {
                applicationJS.push('requirejs:jquery1');
                applicationJS.push('requirejs:jquery2');
            }

            return applicationJS;
        }())
    });

     grunt.config(['copy', 'requirejs'], {
         files: [{
             expand: true,
             cwd:    'source/js/lib/vendors/require/',
             src:    ['*.js'],
             dest:   'content/<%= config.services.default %>/js/lib/vendors/require/'
         }]
     });

     grunt.config(['copy', 'polyfill'], {
         files: [{
             expand: true,
             cwd:    'source/js/lib/vendors/',
             src:    ['legacy-ie-polyfills.js'],
             dest:   'content/<%= config.services.default %>/js/lib/vendors/'
         }]
     });

    grunt.registerTask('copyRequiredJs', function () {
        var filesToCopy = (debugMode ? 'jsAll' : 'requirejs');
        grunt.task.run('copy:' + filesToCopy);
        grunt.task.run('copy:polyfill');
        grunt.task.run('uglify');
    });

    grunt.config('uglify', {
        options: {
            mangle: true
        },
        my_target: {
            files: {
                'source/js/lib/news_special/iframemanager__host.min.js': ['source/js/lib/news_special/iframemanager__host.js']
            }
        }
    });

};
