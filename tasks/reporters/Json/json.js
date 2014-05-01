module.exports = function() {
	var fs = require('fs-extra'),
		path = require('path'),
		parseString = require('xml2js').parseString;

	var JsonConverter = function(options) {
		this.dirname = __dirname;
		this.options = options;
		this.xmlFilename = options.checkstyleXML;

		if(!this.xmlFilename) {
			throw new Error('Output filename not provided!');
		}

		var outputDir = path.dirname(this.xmlFilename);
		var checkstyleXML = fs.readFileSync(outputDir + '/checkstyle.xml').toString();
		var parseConfig = {
			trim: true,
			normalizeTags: true,
			normalize: true,
			ignoreAttrs: false,
			mergeAttrs: true,
			explicitArray: false,
			strict: true
		};

		parseString(checkstyleXML, parseConfig, function (err, result) {
			fs.writeFileSync(outputDir + '/checkstyle.json', JSON.stringify(result, null, 4));
		});
	};

	return JsonConverter;
};