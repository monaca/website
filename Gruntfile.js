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

module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    const sass = require('node-sass');

    var isWindows = /^win/.test(process.platform);
    var isLinux = /^linux/.test(process.platform);
    var workboxBuild = require('workbox-build');
    var precachedFiles = [
        '**/css/bootstrap-theme.min.css',
        '**/css/bootstrap.min.css',
        '**/css/codemirror.css',
        // '**/css/style.css',
        '**/js/all.js',
        '**/js/bootstrap.min.js',
        '**/js/jquery.min.js'
    ];

    var config = {
        src: 'src',
        dist: 'dist/en',
        distJa: 'dist/ja',
        distEn: 'dist/en'
    };

    // Load site.yml
    let siteYaml;
    {
        const site_config = grunt.option('site-config') || 'local'; // Use local by default

        siteYaml = grunt.file.readYAML(config.src + '/data/site_' + site_config + '.yml');
    }

    // Display information
    grunt.log.writeln('Title:        ' + siteYaml.title);
    grunt.log.writeln('API Endpoint: ' + siteYaml.monaca_api);
    grunt.log.writeln('IDE API Endpoint: ' + siteYaml.monaca_ide_api);

    grunt.initConfig({
        config: config,

        stylelint: {
            options: {
                configFile: '.stylelintrc',
                formatter: 'string',
                ignoreDisables: false,
                failOnError: false,
                outputFile: '',
                reportNeedlessDisables: false,
                syntax: 'scss'
            },
            src: [
                // 'src/sass/pages/dev-support.scss', // outputs many warnings, so disabled temporaliry
            ],
        },

        sass: {
            options: {
                implementation: sass,
                // outputStyle: "compressed",
                sourceMap: true,
                includePaths: require('node-bourbon').includePaths
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/sass',
                    src: '**/*.scss',
                    dest: '<%= config.dist %>/css/',
                    ext: '.css'
                }]
            },
            styleguide: {
                options: {
                    sourcemap: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/styleguide',
                    src: '*.scss',
                    dest: 'docs/styleguide',
                    ext: '.css'
                }]
            }
        },

        postcss: {
            options: {
                diff: true,
                map: true,
                processors: [
                    require('autoprefixer')({ grid: true })
                ]
            },
            dist: {
                src: [
                    '<%= config.dist %>/css/pages/dev-support.css',
                ],
            }
        },

        watch: {
            options: {
                livereload: {
                    port: '<%= connect.options.livereload %>',
                    key: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key'),
                    cert: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt')
                }
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
                tasks: ['stylelint', 'sass', 'postcss', 'copy:css'],
                options: {
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
                separator: ";",

            },
            // options : {
            //   process : function(content,path) {
            //     return grunt.template.process(content,{ data : siteYaml } );
            //   }
            // }
        },

        uglify: {
            monaca: {
                options: {
                  ie8: true,
                },
                files: [{
                    expand: true,
                    src: '<%= config.distEn %>/js/all.js',
                    ext: '.js'
                }, {
                    expand: true,
                    src: '<%= config.distJa %>/js/all.js',
                    ext: '.js'
                }]
            },
            vendor: {
                files: [{
                    expand: true,
                    src: ['<%= config.distEn %>/js/**/*.js', '!<%= config.distEn %>/js/**/*.min.js'],
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['<%= config.distJa %>/js/**/*.js', '!<%= config.distJa %>/js/**/*.min.js'],
                    ext: '.js'
                }]
            },
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
                helpers: ['<%= config.src %>/helpers/*.js'],
                flatten: true,
                layout: '<%= config.src %>/templates/layouts/default.hbs',
                data: ['<%= config.src %>/data/i18n/*.{json,yml}'],
                site: siteYaml,
                partials: '<%= config.src %>/templates/partials/*.hbs',
                plugins: ['assemble-middleware-sitemap'],
                i18n: {
                    languages: ["en", "ja"],
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
                    src: ['**/*.hbs', '!**/*.en.hbs', '!**/*.ja.hbs', '!**/*.es.hbs', '!**/*.de.hbs', '!**/*.it.hbs', '!**/*.ru.hbs'],
                    dest: '<%= config.dist %>/'
                }, {
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: '**/*.en.hbs',
                    dest: '<%= config.dist %>/',
                    rename: function (dest, src) {
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
                    },
                    currentYear: new Date().getFullYear()
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: ['**/*.hbs', '!**/*.en.hbs', '!**/*.ja.hbs', '!**/*.es.hbs', '!**/*.de.hbs', '!**/*.it.hbs', '!**/*.ru.hbs'],
                    dest: '<%= config.distJa %>/'
                }, {
                    expand: true,
                    cwd: "<%= config.src %>/templates/pages/",
                    src: '**/*.ja.hbs',
                    dest: '<%= config.distJa %>/',
                    rename: function (dest, src) {
                        return dest + src.replace('.ja.hbs', '.html');
                    }
                }]
            }
        },

        copy: {
            bootstrap: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/',
                src: [
                    'js/bootstrap.min.js',
                    'css/bootstrap.min.css',
                    'fonts/**/*',
                ],
                dest: '<%= config.dist %>/'
            },
            jquery: {
                expand: true,
                cwd: 'bower_components/jquery/dist/',
                src: ['**', '!**/*.js', '**/*.min.js'],
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
                src: '**/*.css',
                dest: '<%= config.distJa %>/css/'
            },
            js: {
                expand: true,
                cwd: '<%= config.dist %>/js/',
                src: 'all.js',
                dest: '<%= config.distJa %>/js/'
            },
            serviceworker: {
                expand: true,
                cwd: '<%= config.dist %>/',
                src: ['sw.js'],
                dest: '<%= config.distJa %>/'
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
                uploadConcurrency: 10,
                downloadConcurrency: 10,
                gzipRename: 'ext',
                params: {
                    CacheControl: 'max-age=120'
                }
            },
            ja: {
                options: {
                    bucket: grunt.option('aws-bucket'),
                    region: grunt.option('aws-region'),
                },
                files: [{
                        action: "delete",
                        dest: '/'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.distJa %>',
                        src: ['**'],
                        dest: ''
                    },
                    {
                        expand: true,
                        cwd: '<%= config.distJa %>',
                        src: ['**/*.js.gz', '**/*.html.gz', '**/*.css.gz'],
                        dest: ''
                    },
                ]
            },
            en: {
                options: {
                    bucket: grunt.option('aws-bucket'),
                    region: grunt.option('aws-region'),
                },
                files: [{
                        action: "delete",
                        dest: '/'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.distEn %>',
                        src: ['**'],
                        dest: ''
                    },
                    {
                        expand: true,
                        cwd: '<%= config.distEn %>',
                        src: ['**/*.js.gz', '**/*.html.gz', '**/*.css.gz'],
                        dest: ''
                    },
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
                protocol: 'http'
            },
            en: {
                options: {
                    open: {
                        target: 'http://localhost:3010',
                        appName: isWindows ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : isLinux ? 'google-chrome' : 'Google Chrome'
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
                        target: 'http://localhost:3011',
                        appName: isWindows ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : isLinux ? 'google-chrome' : 'Google Chrome'
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
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.distEn %>/css/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: '<%= config.distEn %>/css/',
                    ext: '.css'
                }, {
                    expand: true,
                    cwd: '<%= config.distJa %>/css/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: '<%= config.distJa %>/css/',
                    ext: '.css'
                }]
            }
        },

        imagemin: {
            en: {
                files: [{
                    expand: true,
                    cwd: '<%= config.distEn %>/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= config.distEn %>/img/'
                }]
            },
            ja: {
                files: [{
                    expand: true,
                    cwd: '<%= config.distJa %>/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= config.distJa %>/img/'
                }]
            }
        },

        babel: {
            options: {
              sourceMap: true,
              presets: [
                  '@babel/preset-env'
              ]
            },
            dist: {
              files: {
                '<%= config.distEn %>/js/all.js': '<%= config.distEn %>/js/all.js',
                '<%= config.distJa %>/js/all.js': '<%= config.distJa %>/js/all.js'
              }
            }
        }
    });

    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-styledocco');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-stylelint');


    function injectManifest() {
        return new Promise(function (resolve, reject) {
            workboxBuild.injectManifest({
                    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                    globDirectory: 'dist/en/',
                    globPatterns: precachedFiles,
                    swDest: 'dist/en/sw.js',
                    swSrc: 'dist/en/sw-src.js'
                })
                .then(function (result) {
                    if (result) console.log('Precache Files:', result);
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    };

    grunt.registerTask('buildSw', function () {
        var done = this.async();
        injectManifest()
            .then(function () {
                done();
            })
            .catch(function (err) {
                console.log(err);
            });
    });

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
        'stylelint',
        'sass:dist',
        'postcss:dist',
        'concat',
        'copy',
        'babel',
        'uglify',
        'assemble',
        'cssmin',
        'buildSw',
        'copy:serviceworker'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy:ja', [
        'build',
        'compress',
        'imagemin:ja',
        'aws_s3:ja'
    ]);

    grunt.registerTask('deploy:en', [
        'build',
        'compress',
        'imagemin:en',
        'aws_s3:en'
    ]);

    grunt.registerTask('debug:en', [
        'clean:dist',
        'sass:dist',
        'concat',
        'copy',
        'assemble',
        'connect:en',
        'watch'
    ]);

    grunt.registerTask('debug:ja', [
        'clean:dist',
        'sass:dist',
        'concat',
        'copy',
        'assemble',
        'connect:ja',
        'watch'
    ]);

    grunt.registerTask('styleguide', [
        'clean:styleguide',
        'sass:styleguide',
        'copy:styleguide',
        'styledocco'
    ])
};
