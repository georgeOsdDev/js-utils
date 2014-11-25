module.exports = (grunt) ->
  grunt.option "color", false

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    jshint:
      test: ['utils.js']
      options:
        jshintrc: '.jshintrc'
        reporter: require 'jshint-stylish'

    uglify:
      main:
        options:
          #the banner is inserted at the top of the output
          banner: """
                  /*
                   * <%= pkg.name %> v-<%= pkg.version %>
                   * Source code can be found at Github (georgeosd/js-utils)
                   *
                   * The MIT License (MIT)
                   * Copyright (c) 2014 Takeharu Oshida
                   */

                  """

          mangle: true
          sourceMap: true
        files:
          'utils.min.js': 'utils.js'

    jsdoc:
      main:
        src: ["utils.js", "ReadMe.md"]
        options:
          destination: "doc/out/"
          template: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template"
          configure: "jsdoc.conf.json"

    # Some test case is runnable from console
    # This test will be executed by Travis.ci.
    mochaTest:
      test:
        options:
          reporter: 'tap'
        src: [
          'test/utils.js'
        ]

  # load
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-jsdoc'
  grunt.loadNpmTasks 'grunt-mocha-test'

  grunt.registerTask 'default', 'Log some stuff.', ->
    grunt.log.write("""
      --- Available tasks ---
      * jshint          : Run linter
      * uglify          : Run UglifyJS command
      * mochaTest       : Run cui test with mocha
      * jsdoc           : Publish API documents
    """).ok()
