module.exports = function (grunt) {

    grunt.registerTask('create_minified_files', ['sass:inline', 'uglify']);

    grunt.registerTask('html', ['create_minified_files', 'jsonlint', 'multi_lang_site_generator:default']);
};