/*jshint es3: false */
module.exports = function (grunt) {

    var path = require('path');

    function getEnvData() {
        var env = {
            'local': {
                'domain':       'http://local.bbc.co.uk:1031',
                'domainStatic': 'http://static.local.bbc.co.uk:1033'
            }
        };
        var environmentFilePath = path.join(__dirname, '../../env.json');
        if (grunt.file.exists(environmentFilePath)) {
            env = grunt.file.readJSON(environmentFilePath);
        }
        else {
            grunt.log.warn('env.json was NOT found at the following location: ' + environmentFilePath);
            grunt.log.ok('Using hardcoded JSON in Gruntfile.js instead!');
        }
        return env;
    }

    require('time-grunt')(grunt);
    grunt.initConfig({
        env:          getEnvData(),
        pkg:          grunt.file.readJSON('package.json'),
        config:       grunt.file.readJSON('config.json'),
        translations: grunt.file.readJSON('translations.json')
    });
    grunt.loadTasks('tasks');
};
