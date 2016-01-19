module.exports = function (grunt) {

    /**
     * The `grunt translate` task assumes you've already run:
     * - grunt default
     * - grunt images # (if applicable)
     */
    grunt.registerTask('translate', [
        'create_minified_files',
        'multi_lang_site_generator:build_all_other_sites',
        'transfer_fixed_assets',
        'transfer_language_assets',
        'lang_font:others'
    ]);

    grunt.registerTask('transfer_fixed_assets', 'Creates a copy of the default service output for each of the other services. This may seem like something that should be handled in the grunt-multi-lang-site-generator task, but it is very tied to the iFS logic, e.g. we compile and minify our JS before deployment, so we do not want to just copy the raw source.', function () {

        var wrench             = require('wrench'),
            fs                 = require('fs'),
            config             = grunt.config.get('config'),
            default_vocab_dir  = config.services.default,
            rest_of_vocabs_dir = grunt.iframeScaffold.services;

        rest_of_vocabs_dir.forEach(function (vocab_dir) {
            grunt.log.writeln('Copying ' + default_vocab_dir + ' source into ' + vocab_dir + '...');
            wrench.copyDirSyncRecursive('content/' + default_vocab_dir + '/',     'content/' + vocab_dir + '/');
            wrench.copyDirSyncRecursive('content/' + default_vocab_dir + '/js/',  'content/' + vocab_dir + '/js/');
            wrench.copyDirSyncRecursive('content/' + default_vocab_dir + '/css/', 'content/' + vocab_dir + '/css/');
            try {
                if (fs.lstatSync('content/' + default_vocab_dir + '/img').isDirectory()) {
                    wrench.copyDirSyncRecursive('content/' + default_vocab_dir + '/img/', 'content/' + vocab_dir + '/img/');
                }
            } catch (e) {}
        });
    });

    grunt.registerTask('transfer_language_assets', 'Copies WS-specific assets into the correct vocabs directories', function () {
        var services = grunt.iframeScaffold.services,
            modifier;

        services.forEach(function (service) {
            modifier = grunt.config.get('translations')[service].name;

            if (service !== 'english') {
                grunt.file.copy('source/scss/news_special/f/bbc-' + modifier + '.png', 'content/' + service + '/css/f/bbc-' + modifier + '.png');
                grunt.log.writeln('Copied ' + modifier + '.png to content/' + service + '/css/f/' + modifier + '.png');
            }
        });
    });
};