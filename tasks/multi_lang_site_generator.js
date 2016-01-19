module.exports = function (grunt) {

    // *************************************************************************
    // PROJECT FILES
    // Make a list of templates you want converted to files
    // *************************************************************************

    var projectFiles = {
        'index.html': 'index.html.tmpl',
        'index.inc':  'index.inc.tmpl',
        'test.html':  'test.html.tmpl',
        'index.inc.app.html':  'app.html.tmpl'
    };

    // *************************************************************************
    // GRUNT CONFIG
    // You shouldn't need to edit anything below here
    // *************************************************************************

    var config       = grunt.config.get('config'),
        scaffoldLite = config.scaffoldLite === 'true',
        debug        = config.debug        === 'true',
        multi_lang_site_generator_data;

    function getInlineStyleElm() {
        var inlineStyleFile = "source/scss/news_special/inline.min.css",
            inlineCss = '';

        if (grunt.file.exists(inlineStyleFile)) {
            inlineCss = grunt.file.read(inlineStyleFile);
        }
        if (scaffoldLite) {
            inlineCss += grunt.file.read("content/" + config.services.default + "/css/main.css");
        }

        return '<style>' + inlineCss + '</style>';
    }

    function getInlineJs() {
        var inlineLiteJs = '';

        if (scaffoldLite) {
            inlineLiteJs = grunt.file.read("content/" + config.services.default + "/js/lite.js");
        }

        inlineLiteJs = '<script>' + inlineLiteJs + '</script>';

        return inlineLiteJs;
    }

    multi_lang_site_generator_data = {
        version:        '<%= pkg.version %>',
        inlineLiteJs:   getInlineJs,
        inlineStyleElm: getInlineStyleElm,
        path:           '<%= env[config.whichEnv].domain %>/news/special/<%= config.year %>/newsspec_<%= config.project_number %>/content',
        pathStatic:     '<%= env[config.whichEnv].domainStatic %>/news/special/<%= config.year %>/newsspec_<%= config.project_number %>/content',
        projectNumber:  '<%= config.project_number %>',
        amdModulePaths: '<%= JSON.stringify(amdModulePaths) %>',
        translations:   grunt.config.get('translations'),
        debug:          debug,
        scaffoldLite:   scaffoldLite
    };

    grunt.config('multi_lang_site_generator', {
        default: {
            options: {
                vocabs:             ['<%= config.services.default %>'],
                vocab_directory:    'source/vocabs',
                template_directory: 'source/tmpl/',
                output_directory:   'content',
                data:               multi_lang_site_generator_data
            },
            files: projectFiles
        },
        build_all_other_sites: {
            options: {
                vocabs:             '<%= config.services.others %>',
                vocab_directory:    'source/vocabs',
                template_directory: 'source/tmpl/',
                output_directory:   'content',
                data:               multi_lang_site_generator_data
            },
            files: projectFiles
        }
    });
};
