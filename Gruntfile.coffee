module.exports = (grunt) ->
	conf = 
		less: 
			dev: 
				files: 
					'css/press.css': 'less/press.less'
			prod: 
				options: 
					yuicompress: true
				files: 
					'css/press.min.css' : 'less/imagedb.less'

		watch:
			less:
				files: ['less/*.less', 'less/src/*.less']
				tasks: ['less:dev']
				options: 
					interrupt: true
					debounceDelay: 250

	grunt.initConfig conf

	grunt.loadNpmTasks 'grunt-contrib-less'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'default', ['watch']