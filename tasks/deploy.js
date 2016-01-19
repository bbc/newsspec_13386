module.exports = function (grunt) {

    var env  = grunt.config.get('env'),
        path = require('path'),
        sourceFiles = path.join(__dirname, '../content');

    if (env.stage && env.live) { // only define `deploy` task if env.json exists.
        grunt.config(['deploy'], {
            stage: {
                server:  env['stage']['mount'],
                source:  sourceFiles,
                path:    '/news/special/<%= config.year %>/newsspec_<%= config.project_number %>/content',
                replacements: [{
                    from: env['local']['domain'],
                    to:   env['stage']['domain']
                }, {
                    from: env['local']['domainStatic'],
                    to:   env['stage']['domainStatic']
                }],
                beforeDeployment: function (done) {
                    if (volumesAreMounted()) {
                        deployChecklist();
                        done();
                    }
                }
            },
            live: {
                server:  env['live']['mount'],
                source:  sourceFiles,
                path:    '/news/special/<%= config.year %>/newsspec_<%= config.project_number %>/content',
                replacements: [{
                    from: env['local']['domain'],
                    to:   env['live']['domain']
                }, {
                    from: env['local']['domainStatic'],
                    to:   env['live']['domainStatic']
                }],
                beforeDeployment: function (done) {
                    if (volumesAreMounted()) {
                        deployChecklist();
                        checkDeployedToStage(done);
                    }
                }
            }
        });
    }

    function volumesAreMounted() {
        var execSync = require('child_process').execSync;
        var stdout = execSync(
            'ls -ls /Volumes | if grep --quiet "tmp"; then echo "Drives appear to be mounted."; else echo "WARNING"; fi',
            {
                encoding: 'utf8'
            }
        );

        if (stdout.match(/WARNING/)) {
            grunt.fail.warn('You need to mount your network drives before you can deploy to other environments.');
            return false;
        }
        return true;
    }

    function deployChecklist() {

        var config = grunt.config.get('config');
        var propertiesToCheck = [
            {
                value:         config.debug,
                invalidValues: ['true'],
                errMessage:    '"debug" in package.js is set to true, do not deploy to live with this setting!'
            },
            {
                value:         config.project_number,
                invalidValues: ['', '0000'],
                errMessage:    '"project_number" in package.json not set!'
            }
        ];

        propertiesToCheck.forEach(function (property) {
            checkProperty(
                property.value,
                property.invalidValues,
                property.errMessage
            );
        });
    }

    function checkProperty(value, invalidValues, errMessage) {
        if (valueIsInvalid(value, invalidValues)) {
            grunt.log.warn(errMessage);
        }
    }

    function valueIsInvalid(value, invalidValues) {
        return invalidValues.indexOf(value) > -1;
    }

    function checkDeployedToStage(done) {
        var path   = require('path'),
            env    = grunt.config.get('env'),
            config = grunt.file.readJSON('config.json'),
            fs     = require('fs');

        try {
            var stagedProject = fs.lstatSync(env.stage.mount + '/news/special/' + config.year + '/newsspec_' + config.project_number + '/content/' + config.services.default);

            if (stagedProject.isDirectory()) {
                grunt.log.writeln('This content is on stage - OK');
                done();
            }
        } catch (e) {
            grunt.fail.warn('This content has not been staged - Fail');
        }
    }
};