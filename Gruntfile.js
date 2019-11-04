module.exports = function(grunt) {
  require('jit-grunt')(grunt);
    grunt.initConfig({
        less: {
          development: {
            options: {
              compress: true,
              yuicompress: true,
              optimization: 2
            },
            files: {
              "_assets/css/radar.css": "_assets/css/less/radar.less"
            }
          }
        },
	  	concat: {
        options: {
		      separator: ';',
		    },
		    dist: {
          src: ['_assets/js/core/jquery.min.js', '_assets/js/plugin/swiper.min.js', '_assets/js/core/radar.js'],
          dest: '_assets/js/radar.js',
		    },
	  	},
      watch: {
        styles: {
          files: ['_assets/**/*.less'], // which files to watch
          tasks: ['less'],
          options: {
            nospawn: true
          }
        },
        script: {
          files: ['_assets/**/*.js'],
          tasks: ['concat'],
          options: {
            nospawn: true
          }
        },
      },
      browserSync: {
          dev: {
              bsFiles: {
                  src : [
                    '**.css',
                    '**.less',
                    '**.js',
                    '**.html'
                  ]
              },
              options: {
                  server: {
                      baseDir: "./"
                  },
                  watchTask: true
              }
          }
      }                                                                                                                                                                                                                                                             
    });

    grunt.registerTask('default', ['concat', 'less',  'browserSync', 'watch']);
};