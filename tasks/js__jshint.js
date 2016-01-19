module.exports = function (grunt) {
    grunt.config('jshint', {
        options: {
            es3:      true,
            indent:   4,
            curly:    true,
            eqeqeq:   true,
            immed:    true,
            latedef:  true,
            newcap:   true,
            noarg:    true,
            quotmark: true,
            sub:      true,
            boss:     true,
            eqnull:   true,
            trailing: true,
            white:    true,
            force:    true,
            ignores: ['source/js/lib/news_special/template_engine.js', 'source/js/lib/news_special/iframemanager__host.min.js']
        },
        all: ['Gruntfile.js', 'source/js/lib/news_special/*.js', 'source/js/*.js', 'source/js/spec/*.js']
    });
};