const getRepoInfo = require('git-repo-info');

var git_info = getRepoInfo();

let version_hash = git_info.branch + '.' + git_info.abbreviatedSha;

let configuration = {
    'css_build_file': `styles/css/build/build.${version_hash}.css`,
    'css_min_build_file': `styles/css/build/build.${version_hash}.min.css`,
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

        // Font manager
        googlefonts: {
            build: {
                options: {
                    fontPath: 'public/styles/css/fonts/',
                    cssFile: 'public/styles/css/fonts.css',
                    fonts: [{
                        family: 'Open Sans',
                        styles: [
                            400, 700
                        ],
                        subsets: [
                            'latin',
                        ],
                    }]
                }
            }
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
                    spawn: false,
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
                }]
            }
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
    grunt.loadNpmTasks('grunt-google-fonts');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    let build_tasks = ['clean', 'sass', 'htmlmin', 'googlefonts', 'concat', 'cssmin', 'string-replace', 'copy'];

    grunt.registerTask('default', build_tasks);

    grunt.registerTask('serve', [
        ...build_tasks,
        'connect',
        'watch',
    ]);
};