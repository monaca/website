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

    grunt.initConfig({

        config: {
            src: 'src',
            dist: 'dist/en',
            distJa: 'dist/ja'
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
                    dest  : '<%= config.dist %>/css/',
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
            assets: {
                files: ['<%= config.src %>/assets/**/*'],
                tasks: ['copy'],
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
                dest: '<%= config.dist %>/js/all.js',
                separator: ";"
            }
        },

        assemble: {
            options: {
                flatten: true,
                layout: '<%= config.src %>/templates/layouts/default.hbs',
                data: '<%= config.src %>/data/**/*.{json,yml}',
                partials: '<%= config.src %>/templates/partials/*.hbs',
                i18n: {
                    languages: ["en", "ja"],
                    templates: ["<%= config.src %>/templates/pages/*.hbs"],
                }
            },
            en: {
                options: {
                    language: "en"
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: ['**/*.hbs', '!**/*.en.hbs', '!**/*.ja.hbs'],
                    dest: '<%= config.dist %>/'
                }, {
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: '**/*.en.hbs',
                    dest: '<%= config.dist %>/',
                    rename: function(dest, src) {
                        return dest + src.replace('.en.hbs', '.html');
                    }
                }]
            },
            ja: {
                options: {
                    language: "ja"
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: ['**/*.hbs', '!**/*.en.hbs', '!**/*.ja.hbs'],
                    dest: '<%= config.distJa %>/'
                }, {
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: '**/*.ja.hbs',
                    dest: '<%= config.distJa %>/',
                    rename: function(dest, src) {
                        return dest + src.replace('.ja.hbs', '.html');
                    }
                }]
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
            fontawesome: {
                expand: true,
                cwd: 'bower_components/fontawesome/',
                src: ['css/font-awesome.min.css', 'fonts/**'],
                dest: '<%= config.dist %>/'
            },
            codemirror_js: {
                expand: true,
                cwd: 'bower_components/codemirror/lib/',
                src: 'codemirror.js',
                dest: '<%= config.dist %>/js/'
            },
            codemirror_css: {
                expand: true,
                cwd: 'bower_components/codemirror/lib/',
                src: 'codemirror.css',
                dest: '<%= config.dist %>/css/'
            },
            assets: {
                expand: true,
                cwd: 'src/assets/',
                src: '**',
                dest: '<%= config.dist %>/'
            },
            multilocale: {
                expand: true,
                cwd: '<%= config.dist %>',
                src: '**',
                dest: '<%= config.distJa %>'
            }
        },

        aws: grunt.file.readJSON('aws_keys.json'),

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.key %>', // Use the variables
                secretAccessKey: '<%= aws.secret %>', // You can also use env variables
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            ja: {
                options: {
                    bucket: 'ja.monaca.io',
                    region: 'ap-northeast-1',
                },
                files: [
                    {expand: true, cwd: '<%= config.distJa %>', src: ['**'], dest: ''},
                ]
            },
        },

        invalidate_cloudfront: {
            options: {
               key: '<%= aws.key %>',
               secret: '<%= aws.secret %>',
               distribution: 'EV2KT3V34BFDP'
            },
            production: {
                files: [{
                    expand: true,
                    cwd: '<%= config.distJa %>',
                    src: ['**'],
                    filter: 'isFile',
                    dest: ''
                }]
           }
        },

        clean: ['dist/**/*'],

        connect: {
            options: {
                port: 3010,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            en: {
                options: {
                    open: true,
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            },
            ja: {
                options: {
                    open: true,
                    base: [
                        '<%= config.distJa %>'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-invalidate-cloudfront');

    grunt.registerTask('server', [
        'build',
        'connect:en',
        'watch'
    ]);

    grunt.registerTask('server:ja', [
        'build',
        'connect:ja',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'sass',
        'concat',
        'copy',
        'assemble'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'aws_s3',
        'invalidate_cloudfront'
    ]);

};
