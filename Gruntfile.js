/* jshint node:true */
/* global require */

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-wp-readme-to-markdown');
	grunt.initConfig(
		{
			version: {
				project: {
					src: [
					'package.json'
					]
				},
				composer: {
					src: [
					'composer.json'
					]
				},
				mainClass: {
					options: {
						prefix: '\\.*\\VERSION\.*\\s=\.*\\s\''
					},
					src: [
					'includes/Main.php'
					]
				},
				metatag: {
					options: {
						prefix: 'Version:\\s*',
						flags: ''
					},
					src: [ 'templates-patterns-collection.php' ],
				},
				php: {
					options: {
						prefix: 'TIOB_VERSION\', \'',
						flags: ''
					},
					src: [ 'templates-patterns-collection.php' ]
				},
				readmetxt: {
					options: {
						prefix: 'Stable tag:\\s*'
					},
					src: [
						'readme.txt'
					]
				},
			},
			wp_readme_to_markdown: {
				plugin: {
					files: {
						'README.md': 'readme.txt'
					},
				},
			},
		}
	);
};
