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

    var isWindows = /^win/.test(process.platform);

    grunt.initConfig({

        config: {
            src: 'src',
            dist: 'dist/en',
            distJa: 'dist/ja',
            distEn: 'dist/en'
        },

        sass: {
            options: {
                outputStyle: "compressed",
                sourceMap: true,
                includePaths: require('node-bourbon').includePaths
            },
            dist: {
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
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            assemble: {
                files: ['<%= config.src %>/{content,data,templates}/**/*.{md,hbs,yml,json}'],
                tasks: ['assemble']
            },
            assets: {
                files: ['<%= config.src %>/assets/**/*'],
                tasks: ['copy'],
            },
            sass: {
                files: ['<%= config.src %>/**/*.scss'],
                tasks: ['sass', 'copy:css'],
                options : {
                    spawn: false
                }
            },
            js: {
                files: ['<%= config.src %>/**/*.js'],
                tasks: ['concat', 'copy:js']
            },
            //styleguide: {
            //    files: ['<%= config.src %>/**/*.scss'],
            //    tasks: ['styleguide']
            //}
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

        uglify: {
            en: {
                files: {"<%= config.dist %>/js/all.js": ["<%= config.dist %>/js/all.js"]}
            },
            ja: {
                files: {"<%= config.distJa %>/js/all.js": ["<%= config.distJa %>/js/all.js"]}
            }
        },

        compress: {
            options: {
                mode: "gzip",
                pretty: true,
		level: 9
            },
            html: {
                files: [{
                    expand: true,
                    src: '<%= config.distEn %>/**/*.html',
                    ext: '.html.gz'
                }, {
                    expand: true,
                    src: '<%= config.distJa %>/**/*.html',
                    ext: '.html.gz'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    src: '<%= config.distEn %>/**/*.css',
                    ext: '.css.gz'
                }, {
                    expand: true,
                    src: '<%= config.distJa %>/**/*.css',
                    ext: '.css.gz'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    src: '<%= config.distEn %>/**/*.js',
                    ext: '.js.gz'
                }, {
                    expand: true,
                    src: '<%= config.distJa %>/**/*.js',
                    ext: '.js.gz'
                }]
            }
        },

        assemble: {
            options: {
                flatten: true,
                layout: '<%= config.src %>/templates/layouts/default.hbs',
                data: '<%= config.src %>/data/**/*.{json,yml}',
                partials: '<%= config.src %>/templates/partials/*.hbs',
                plugins: ['assemble-middleware-sitemap'],
                i18n: {
                    languages: ["en", "ja", "it"],
                    templates: ["<%= config.src %>/templates/pages/*.hbs"],
                },
                sitemap: {
                    changefreq: 'weekly',
                    priority: '0.5',
                    https: true,
                    robot: false
                },
            },
            en: {
                options: {
                    language: "en",
                    sitemap: {
                        dest: '<%= config.distEn %>',
                        relativedest: '<%= config.distEn %>',
                        homepage: 'http://monaca.io',
                        exclude: ["google4c5ba612e05a835b", "error404", "error500"]
                    }
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: ['**/*.hbs', '!**/*.en.hbs', '!**/*.ja.hbs', '!**/*.it.hbs'],
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
                    language: "ja",
                    sitemap: {
                        dest: '<%= config.distJa %>',
                        relativedest: '<%= config.distJa %>',
                        homepage: 'http://ja.monaca.io',
                        exclude: ["google4c5ba612e05a835b", "error404", "error500"]
                    }
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: ['**/*.hbs', '!**/*.en.hbs', '!**/*.ja.hbs', '!**/*.it.hbs'],
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
            },
            it: {
                options: {
                    language: "it"
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: 'index.it.hbs',
                    dest: '<%= config.dist %>/it/',
                    rename: function(dest, src) {
                        return dest + src.replace('.it.hbs', '.html');
                    }
                }]
            },
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
            css: {
                expand: true,
                cwd: '<%= config.dist %>/css/',
                src: 'style.*',
                dest: '<%= config.distJa %>/css/'
            },
            js: {
                expand: true,
                cwd: '<%= config.dist %>/js/',
                src: 'all.js',
                dest: '<%= config.distJa %>/js/'
            },
            styleguide: {
                expand: true,
                cwd: '<%= config.dist %>/img/',
                src: 'common/*',
                dest: 'docs/img/'
            }
        },

        aws_s3: {
            options: {
                accessKeyId: grunt.option('aws-key'),
                secretAccessKey: grunt.option('aws-secret'),
                uploadConcurrency: 5,
                downloadConcurrency: 5,
                gzipRename: 'ext',
                params: {
                    CacheControl: 'max-age=3600'
                }
            },
            ja: {
                options: {
                    bucket: grunt.option('aws-bucket'),
                    region: grunt.option('aws-region'),
                },
                files: [
                    {action: "delete", dest: '/'},
                    {expand: true, cwd: '<%= config.distJa %>', src: ['**'], dest: ''},
                    {expand: true, cwd: '<%= config.distJa %>', src: ['**/*.js.gz', '**/*.html.gz', '**/*.css.gz'], dest: ''},
                ]
            },
            en: {
                options: {
                    bucket: grunt.option('aws-bucket'),
                    region: grunt.option('aws-region'),
                },
                files: [
                    {action: "delete", dest: '/'},
                    {expand: true, cwd: '<%= config.distEn %>', src: ['**'], dest: ''},
                    {expand: true, cwd: '<%= config.distEn %>', src: ['**/*.js.gz', '**/*.html.gz', '**/*.css.gz'], dest: ''},
                ]
            },
        },

        clean: {
            dist: ['dist/**/*'],
            styleguide: ["docs/styleguide"]
        },

        connect: {
            options: {
                livereload: 35729,
                hostname: '0.0.0.0',
                protocol: 'https'
            },
            en: {
                options: {
                    open: {
                        target: 'https://localhost:3010',
                        appName: isWindows ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : 'Google Chrome'
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
                        target: 'https://localhost:3011',
                        appName: isWindows ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : 'Google Chrome'
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
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-aws-s3');
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
        'uglify:en',
        'copy',
        'uglify:ja',
        'assemble',
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy:ja', [
        'build',
        'compress',
        'aws_s3:ja'
    ]);

    grunt.registerTask('deploy:en', [
        'build',
        'compress',
        'aws_s3:en'
    ]);

    grunt.registerTask('styleguide', [
        'clean:styleguide',
        'sass:styleguide',
        'copy:styleguide',
        'styledocco'
    ])
};
