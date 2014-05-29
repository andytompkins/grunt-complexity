module.exports = function() {
	var fs = require('fs-extra'),
		path = require('path');

	var HtmlBuilder = function(options) {
		this.fileName = options.checkstyleXML;

		if(!this.fileName) {
			throw new Error('Output filename not provided!');
		}

		this.dirname = __dirname;
		var outputDir = path.dirname(this.fileName);

		var checkstyleJSON = fs.readFileSync(outputDir + '/checkstyle.json');
		var checkstyleResults = JSON.parse(checkstyleJSON);

		var html = this.buildHtml(checkstyleResults);

		fs.writeFileSync(outputDir + '/checkstyle.html', html);
	};

	HtmlBuilder.prototype.buildHtml = function(results) {
		var html = '' +
			'<!DOCTYPE html>' +
			'<html>' +
				'<head>' +
					this.buildHtmlHeader() +
				'</head>' +
				'<body>' +
					this.buildHtmlBody(results) +
				'</body>' +
			'</html>';

		return html;
	};

	HtmlBuilder.prototype.buildHtmlHeader = function () {
		var header = '' +
			'<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" />' +
			this.getStyles();

		return header;
	};

	HtmlBuilder.prototype.getStyles = function () {
		var styles = '' +
			'<style>' +
				'table { width: 100%}' +
				'td { padding: 5px;}' +
				'thead th {font-weight: 700; border-bottom: 2px solid black}' +
				'tr.serverity-warning td {background-color: #fee6c6}' +
				'tr.serverity-info td {background-color: #ddcef2}' +
				'tr.serverity-error td {background-color: #f0ced7}' +
			'</style>';

		return styles;
	};

	HtmlBuilder.prototype.buildHtmlBody = function (results) {
		var body = '' +
			'<div class="container">' +
				'<h1>Complexity Report</h1>' +
				this.buildResultSet(results) +
			'</div>';

		return body;
	};

	HtmlBuilder.prototype.buildResultSet = function(results) {
		var resultHtml = [];
		var errorFiles = results.checkstyle.file;

		for(var i = 0, j = errorFiles.length; i < j; i++) {
			var errorFile = errorFiles[i];


			if(errorFile.name && errorFile.error) {
				var errors = this.buildErrors(errorFile.error);
				var heading = this.buildErrorHeading(errorFile.name);

				if(heading && errors) {
					resultHtml.push(heading);
					resultHtml.push(errors);
				}
			}
		}

		return resultHtml.join('');
	};

	HtmlBuilder.prototype.buildErrorHeading = function(fileName) {
		return "<h3><a href='/webapp/" + fileName + "'>" + fileName + "</a></h3>";
	};

	HtmlBuilder.prototype.buildErrors = function(fileErrors) {
		var errors = [];

		if(fileErrors.length > 0) {
			errors.push('' +
			'<table class="table table-bordered">' +
				'<thead>' +
					'<tr class="row">' +
						'<th class="col-md-6 text-left">Source</th>' +
						'<th class="col-md-1 text-center">Severity</th>' +
						'<th class="col-md-1 text-right">Cyclomatic</th>' +
						'<th class="col-md-1 text-right">Halstead</th>' +
						'<th class="col-md-1 text-right">Effort</th>' +
						'<th class="col-md-1 text-right">Volume</th>' +
						'<th class="col-md-1 text-right">Vocabulary</th>' +
					'</tr>' +
				'</thead>' +
				'<tbody>'
			);

			for(var i = 0, j = fileErrors.length; i < j; i++) {
				var error = fileErrors[i];

				if(error) {
					var tr = '' +
						'<tr class="row serverity-' + error.severity + '">' +
							'<td class="col-md-4 text-left"><span class="pull-right">ln: ' + error.line + '</span>' + error.source + '</td>' +
							'<td class="col-md-3 text-center">' + error.severity + '</td>' +
							'<td class="col-md-1 text-right">' + error.cyclomatic + '</td>' +
							'<td class="col-md-1 text-right">' + error.halstead + '</td>' +
							'<td class="col-md-1 text-right">' + error.effort + '</td>' +
							'<td class="col-md-1 text-right">' + error.volume + '</td>' +
							'<td class="col-md-1 text-right">' + error.vocabulary + '</td>' +
						'</tr>';

					errors.push(tr);
				}
			}

			errors.push('' +
				'</tbody>' +
			'</table>'
			);
		}

		return errors.join('');
	};

	return HtmlBuilder;
};
