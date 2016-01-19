module.exports = function (grunt) {

    grunt.config(['shared_config'], {
        default: {
            options: {
                name: 'globalConfig',
                cssFormat: 'dash',
                jsFormat: 'uppercase',
                ngconstant: true
            },
            src: './config.json',
            dest: [
                './source/scss/news_special/_config.scss'
            ]
        }
    });

    /**
     * If user sets config.services.others to "*", the generated SASS is $services-others: *, which
     * raises a compilation error.
     * Instead we need to replace * with a placeholder before running the shared_config task,
     * then replace the placeholder back with a * afterwards.
     */

    var SHARED_CONFIG_PLACEHOLDER = 'SHARED_CONFIG_PLACEHOLDER',
        readConfigFile = function () {
            return grunt.file.read('config.json', {encoding: 'utf8'});
        },
        writeConfigFile = function (contents) {
            grunt.file.write('config.json', contents);
        };

    grunt.registerTask('shared_config__prepare', function () {
        var preparedContents = readConfigFile().replace('*', SHARED_CONFIG_PLACEHOLDER);
        writeConfigFile(preparedContents);
    });

    grunt.registerTask('shared_config__cleanup', function () {
        var revertedContents = readConfigFile().replace(SHARED_CONFIG_PLACEHOLDER, '*');
        writeConfigFile(revertedContents);
    });

    grunt.registerTask('generate_shared_config', ['shared_config__prepare', 'shared_config', 'shared_config__cleanup']);
};