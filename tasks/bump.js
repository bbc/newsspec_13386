module.exports = function (grunt) {

    grunt.config(['bump'], {
        options: {
            files:         ['package.json'],
            commit:        false,
            createTag:     false,
            push:          false
        }
    });

};