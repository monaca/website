/*
 * Generated on 2014-11-05
 * generator-assemble v0.5.0
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        config: {
            src: 'src',
            dist: 'dist'
        },

        sass: {
            dist: {
                options: {
                    sourcemap: true
                },
                files: [{
                    expand: true,
                    cwd   : 'src/sass',
                    src   : '*.scss',
                    dest  : 'dist/css/',
                    ext   : '.css'
                }]
            }
        },
        watch: {
            assemble: {
                files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
                tasks: ['assemble']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.dist %>/{,*/}*.html',
                    '<%= config.dist %>/{,*/}*.css',
                    '<%= config.dist %>/{,*/}*.js',
                    '<%= config.dist %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            sass: {
                files: ['<%= config.src %>/**/*.scss'],
                tasks: ['sass'],
                options : {
                    spawn: false
                }
            },
            js: {
                files: ['<%= config.src %>/**/*.js'],
                tasks: ['concat']
            },
        },
        concat: {
            dist: {
                src: [
                    '<%= config.src %>/js/**/*.js'
                ],
                dest: '<%= config.dist %>/js/all.js'
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            }
        },

        assemble: {
            pages: {
                options: {
                    flatten: true,
                    assets: '<%= config.dist %>/assets',
                    layout: '<%= config.src %>/templates/layouts/default.hbs',
                    data: '<%= config.src %>/data/*.{json,yml}',
                    partials: '<%= config.src %>/templates/partials/*.hbs'
                },
                files: {
                    '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
                }
            }
        },

        copy: {
            bootstrap: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/',
                src: '**',
                dest: '<%= config.dist %>/'
            },
            jquery: {
                expand: true,
                cwd: 'bower_components/jquery/dist/',
                src: '**',
                dest: '<%= config.dist %>/js/'
            },
            assets: {
                expand: true,
                cwd: 'src/assets/',
                src: '**',
                dest: '<%= config.dist %>/'
            }
        },

        // Before generating any new files,
        // remove any previously-created files.
        clean: ['<%= config.dist %>/**/*.{html,xml}']

    });
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('server', [
        'build',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'sass',
        'concat',
        'assemble'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};
