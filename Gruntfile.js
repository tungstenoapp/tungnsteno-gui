const getRepoInfo = require('git-repo-info');

var git_info = getRepoInfo();

let version_hash = git_info.branch + '.' + git_info.abbreviatedSha;

let configuration = {
    'css_build_file': `styles/css/build/build.${version_hash}.css`,
    'css_min_build_file': `styles/css/build/build.${version_hash}.min.css`,
    'js_min_build_vendor': `js/build/vendor.${version_hash}.min.js`,
    'js_min_build_app': `js/build/app.${version_hash}.min.js`,
};

let replacement_list = [];

for (let key in configuration) {
    replacement_list.push({
        pattern: `%${key}%`,
        replacement: configuration[key]
    })
}
module.exports = function (grunt) {

    grunt.initConfig({
        // Clean up build directory
        clean: {
            css: ['public/styles/css/build'],
            all: ['public/']
        },

        // For development purpouse.
        watch: {
            sass: {
                files: ['src/sass/**/*.sass'],
                tasks: ['clean:css', 'sass', 'concat:css', 'cssmin'],
                options: {
                    spawn: false,
                    livereload: true,
                },
            },
            html: {
                files: ['src/html/**/*.html'],
                tasks: ['htmlmin', 'string-replace:html'],
                options: {
                    spawn: true,
                    livereload: true,
                },
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['uglify:app'],
                options: {
                    spawn: true,
                    livereload: true,
                },
            }
        },

        // For development purpouse.
        connect: {
            server: {
                options: {
                    livereload: true,
                    base: 'public/',
                    port: 9009
                }
            }
        },

        // Generate CSS files
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/sass/',
                    src: ['**/*.sass'],
                    dest: './public/styles/css',
                    ext: '.css'
                }],

            },
        },

        // Minify HTML
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/html',
                    src: ['**/*.html'],
                    dest: 'public'
                }]
            }
        },

        // Concatenate files
        concat: {
            css: {
                src: ['public/styles/css/**/*.css'],
                dest: `public/${configuration.css_build_file}`
            }
        },

        uglify: {
            vendor: {
                files: {
                    [`public/${configuration.js_min_build_vendor}`]: [
                        'node_modules/vue/dist/vue.js', 'node_modules/vue-contenteditable/dist/contenteditable.min.js',
                        'node_modules/@saeris/vue-spinners/lib/@saeris/vue-spinners.umd.min.js',
                    ]
                }
            },
            app: {
                files: {
                    [`public/${configuration.js_min_build_app}`]: ['src/js/**/*.js', '!dist/**']
                }
            }
        },

        // Minify CSS
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    [`public/${configuration.css_min_build_file}`]: [`public/${configuration.css_build_file}`]
                }
            }
        },


        'string-replace': {
            html: {
                files: {
                    'public/': 'public/**.html',
                },
                options: {
                    replacements: replacement_list
                }
            }
        },

        copy: {
            fonts: {
                files: [
                    // includes files within path
                    {
                        cwd: 'public/styles/css/',
                        expand: true,
                        src: ['fonts'],
                        dest: 'build',
                    }
                ],
            },
        },

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-string-replace');
    //grunt.loadNpmTasks('grunt-google-fonts');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');


    let build_tasks = ['clean', 'sass', 'htmlmin', 'concat', 'cssmin', 'string-replace', 'uglify'];

    grunt.registerTask('default', build_tasks);

    grunt.registerTask('serve', [
        ...build_tasks,
        'connect',
        'watch',
    ]);
};