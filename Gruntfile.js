module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jst: {
      compile: {
        files: {
          "ooiui/static/js/partials/compiled/loginDemo.js": ["ooiui/static/js/partials/loginForm.html"]
        }
      }
    },
    concat: {
      js: {
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          },
        },
        files: {
          'ooiui/static/js/compiled/science.js' : [
            'ooiui/static/lib/leaflet/dist/leaflet.js',
            'ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
            'ooiui/static/lib/leaflet.markercluster/dist/leaflet.markercluster.js',
            'ooiui/static/lib/moment/moment.js',
            'ooiui/static/lib/bootstrap3-datetimepicker/src/js/bootstrap-datetimepicker.js',
            'ooiui/static/lib/fancytree/dist/jquery.fancytree-all.js',
            'ooiui/static/js/core/science/map.js', 
            'ooiui/static/js/core/science/plot.js',
            'ooiui/static/js/core/science/toc_menu.js',
            'ooiui/static/js/core/science/variable_list.js'
          ],
          'ooiui/static/js/compiled/loginDemo.js' : [
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js'
            //'ooiui/static/js/views/common/LoginView.js'
          ]
        }
      },
      css: {
        files: {
          "ooiui/static/css/compiled/science.css" : [
            "ooiui/static/lib/leaflet/dist/leaflet.css",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css",
            "ooiui/static/css/common/index.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.css" ,
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.Default.css" ,
            "ooiui/static/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
            "ooiui/static/css/common/plot.css",
            "ooiui/static/lib/fancytree/dist/skin-bootstrap/ui.fancytree.css" ,
            "ooiui/static/css/common/toc_menu.css"
          ],
          "ooiui/static/css/compiled/loginDemo.css" : [
            "ooiui/static/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css"
          ]
        }
      }
    }
  })

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jst');

};
