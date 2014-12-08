ld:/*
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
            distJa: 'dist/ja',
            distEn: 'dist/en'
        },

        sass: {
            dist: {
                options: {
                    sourcemap: false
                },
                files: [{
                    expand: true,
                    cwd   : 'src/sass',
                    src   : '*.scss',
                    dest  : '<%= config.dist %>/css/',
                    ext   : '.css'
                }]
            },
            styleguide: {
                options: {
                    sourcemap: false
                },
                files: [{
                    expand: true,
                    cwd   : '<%= config.src %>/styleguide',
                    src   : '*.scss',
                    dest  : 'docs/styleguide',
                    ext   : '.css'
                }]
            }
        },

        watch: {
            assemble: {
                files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml,json}'],
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
            styleguide: {
                files: ['<%= config.src %>/**/*.scss'],
                tasks: ['styleguide']
            }
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
            codemirror: {
                files: [{
                    src: ['bower_components/codemirror/lib/codemirror.js'],
                    dest: '<%= config.dist %>/js/codemirror/codemirror.js'
                }, {
                    expand: true,
                    cwd: 'bower_components/codemirror/mode/',
                    src: ['javascript/*.js', 'htmlmixed/*.js', 'xml/xml.js'],
                    dest: '<%= config.dist %>/js/codemirror/mode/'
                }, {
                    src: 'bower_components/codemirror/lib/codemirror.css',
                    dest: '<%= config.dist %>/css/codemirror.css'
                }]
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
            },
            styleguide: {
                expand: true,
                cwd: '<%= config.dist %>/img/',
                src: '**',
                dest: 'docs/img/'
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
            en: {
                options: {
                    bucket: 'monaca.io',
                    region: '',
                },
                files: [
                    {expand: true, cwd: '<%= config.distEn %>', src: ['**'], dest: ''},
                ]
            },
        },

        invalidate_cloudfront: {
            options: {
               key: '<%= aws.key %>',
               secret: '<%= aws.secret %>',
            },
            ja: {
                options: {
                  distribution: 'EV2KT3V34BFDP'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.distJa %>',
                    src: ['**'],
                    filter: 'isFile',
                    dest: ''
                }]
            },
            en: {
                options: {
                  distribution: 'EKMC7S6TCNKNJ'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.distEn %>',
                    src: ['**'],
                    filter: 'isFile',
                    dest: ''
                }]
           }
        },

        clean: {
            dist: ['dist/**/*'],
            styleguide: ["docs/styleguide"]
        },
        connect: {
            options: {
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            en: {
                options: {
                    open: {
                        target: 'http://0.0.0.0:3010',
                        appName: 'Google Chrome'
                    },
                    port: 3010,
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            },
            ja: {
                options: {
                    open: {
                        target: 'http://0.0.0.0:3011',
                        appName: 'Google Chrome'
                    },
                    port: 3011,
                    base: [
                        '<%= config.distJa %>'
                    ]
                }
            }
        },

        styledocco: {
            dist: {
                options: {
                    name: 'monaca.io',
                    include: [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'docs/styleguide/styleguide.css',
                        'docs/styleguide/button.css'
                    ]
                },
                files: {
                    'docs/styleguide': ['docs/styleguide/']
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
    grunt.loadNpmTasks('grunt-styledocco');

    grunt.registerTask('server', [
        'build',
        'connect:en',
        'connect:ja',
        'watch'
    ]);

    grunt.registerTask('server:en', [
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
        'clean:dist',
        'sass:dist',
        'concat',
        'copy',
        'assemble'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy:ja', [
        'build',
        'aws_s3:ja',
        'invalidate_cloudfront:ja'
    ]);

    grunt.registerTask('deploy:en', [
        'build',
        'aws_s3:en',
        'invalidate_cloudfront:en'
    ]);

    grunt.registerTask('styleguide', [
        'clean:styleguide',
        'sass:styleguide',
        'copy:styleguide',
        'styledocco'
    ])
};
