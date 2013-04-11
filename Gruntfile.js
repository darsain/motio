/*jshint node:true */
module.exports = function(grunt) {
	'use strict';

	// Override environment based line endings enforced by Grunt
	grunt.util.linefeed = '\n';

	// Grunt configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('component.json'),
		meta: {
			banner: '/*!\n' +
				' * <%= pkg.title %> <%= pkg.version %> - <%= grunt.template.today("dS mmm yyyy") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Licensed under the <%= pkg.licenses[0].type %> license.\n' +
				' * <%= pkg.licenses[0].url %>\n' +
				' */\n',
			bannerLight: '/*! <%= pkg.title %> <%= pkg.version %>' +
				' - <%= grunt.template.today("dS mmm yyyy") %> | <%= pkg.homepage %> */'
		},

		// JSHint the code.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['src/*.js']
		},

		// Clean folders.
		clean: {
			dist: ['dist/**', '!dist']
		},

		// Concatenate files.
		concat: {
			options: {
				banner: '<%= meta.banner %>'
			},
			vanilla: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.js'
			},
			jquery: {
				src: ['src/<%= pkg.name %>.js', 'src/jquery.js'],
				dest: 'dist/jquery.<%= pkg.name %>.js'
			}
		},

		// Minify with Google Closure Compiler.
		gcc: {
			options: {
				banner: '<%= meta.bannerLight %>'
			},
			vanilla: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			},
			jquery: {
				src: ['src/<%= pkg.name %>.js', 'src/jquery.js'],
				dest: 'dist/jquery.<%= pkg.name %>.min.js'
			}
		},

		// Compress files.
		compress: {
			options: {
				mode: 'gzip'
			},
			vanilla: {
				src: 'dist/<%= pkg.name %>.min.js',
				dest: 'dist/<%= pkg.name %>.min.js.gz'
			},
			jquery: {
				src: 'dist/jquery.<%= pkg.name %>.min.js',
				dest: 'dist/jquery.<%= pkg.name %>.min.js.gz'
			}
		},

		// Bump up fields in JSON files.
		bumpup: ['component.json', '<%= pkg.name %>.jquery.json'],

		// Commit changes and tag the latest commit with a version from JSON file.
		tagrelease: 'component.json'
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-tagrelease');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-gcc');

	// Task for updating the pkg config property. Needs to be run after
	// bumpup so the next tasks in queue can work with updated values.
	grunt.registerTask('updatePkg', function () {
		grunt.config.set('pkg', grunt.file.readJSON('component.json'));
	});

	// Build task.
	grunt.registerTask('build', function () {
		grunt.task.run('clean');
		grunt.task.run('concat');
		grunt.task.run('gcc');
	});

	// Release task.
	grunt.registerTask('release', function (type) {
		type = type ? type : 'patch';
		grunt.task.run('jshint');
		grunt.task.run('bumpup:' + type);
		grunt.task.run('updatePkg');
		grunt.task.run('build');
		grunt.task.run('tagrelease');
	});

	// Default task.
	grunt.registerTask('default', ['jshint']);
};