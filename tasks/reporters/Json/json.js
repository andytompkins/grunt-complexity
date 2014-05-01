module.exports = function(grunt) {
	var fs = require('fs-extra'),
		path = require('path'),
		parseString = require('xml2js').parseString;

	var JsonReporter = function(options) {

		this.options = options;
		this.xmlFilename = options['checkstyleXML'];

		if(!this.xmlFilename) {
			throw new Error('Output filename not provided!');
		}

		this.dirname = __dirname;

		var outputDir = path.dirname(this.xmlFilename);
		var checkstyleXML = fs.readFileSync(outputDir + '/checkstyle.xml').toString();

		parseString(checkstyleXML, function (err, result) {
			fs.writeFileSync(outputDir + '/checkstyle.min.json', JSON.stringify(result));
			fs.writeFileSync(outputDir + '/checkstyle.json', JSON.stringify(result, null, 4));
		});
	};

	return JsonReporter;
};