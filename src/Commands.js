var cheerio = require('cheerio');
var BC = require('big-cheese');
var Command = BC.Command;
var DataSources = require('./DataSources');

var Commands = {
	// grabs all the companies of a given accelerator
	// expects an accelerator_id in the options
	accelerator_companies: Command(DataSources, ['seeddb.accelerator_companies'], function (opts, dataSourceGetters) {
		var acceleratorCompaniesPromise = dataSourceGetters['seeddb.accelerator_companies'](opts);
		var resultsPromise = acceleratorCompaniesPromise.then(function (html) {
			var $ = cheerio.load(html);
			var $table = $('#seedcos');
			var $accelerators = $table.find('tbody tr');
			var accelerators = $accelerators.map(function (i, el) {
				var $el = $(el);
				return {
					state: $el.find('td:nth-child(1)').text().trim(),
					name: $el.find('td:nth-child(2)').text().trim(),
					crunchbase_url: $el.find('td:nth-child(2) a').attr('href'),
					company_url: $el.find('td:nth-child(3) a:nth-child(1)').attr('href'),
					cohort_date: $el.find('td:nth-child(4)').text().trim(),
					exit_value: $el.find('td:nth-child(5)').text().replace('$', '').trim(),
					funding: $el.find('td:nth-child(7)').text().replace('$', '').trim(),
				};
			}).get();
			return accelerators;
		});
		return resultsPromise;
	}),
	// grabs all the accelerators (not groups)
	accelerators: Command(DataSources, ['seeddb.accelerators'], function (opts, dataSourceGetters) {
		var acceleratorsPromise = dataSourceGetters['seeddb.accelerators'](opts);
		var resultsPromise = acceleratorsPromise.then(function (html) {
			var $ = cheerio.load(html);
			var $table = $('#accellist');
			var $accelerators = $table.find('tbody tr');
			var accelerators = $accelerators.map(function (i, el) {
				var $el = $(el);
				return {
					name: $el.find('td:nth-child(2)').text().replace('Link', '').trim(),
					seeddb_url: $el.find('td:nth-child(2) a:nth-child(1)').attr('href'),
					company_url: $el.find('td:nth-child(2) a:nth-child(2)').attr('href'),
					location: $el.find('td:nth-child(3)').text().trim(),
					country: $el.find('td:nth-child(4)').text().trim(),
					company_count: $el.find('td:nth-child(5)').text().trim(),
					exits: $el.find('td:nth-child(6)').text().replace('$', '').trim(),
					funding: $el.find('td:nth-child(7)').text().replace('$', '').trim(),
					average: $el.find('td:nth-child(8)').text().replace('$', '').trim(),
					median: $el.find('td:nth-child(9)').text().replace('$', '').trim(),
				};
			}).get();
			return accelerators;
		});
		return resultsPromise;
	}),
	// grabs all the exits from all accelerators
	exits: Command(DataSources, ['seeddb.exits'], function (opts, dataSourceGetters) {
		var exitsPromise = dataSourceGetters['seeddb.exits'](opts);
		var resultsPromise = exitsPromise.then(function (html) {
			var $ = cheerio.load(html);
			var $table = $('#seedcos');
			var $companies = $table.find('tbody tr');
			var companies = $companies.map(function (i, el) {
				var $el = $(el);
				return {
					state: $el.find('td:nth-child(1)').text().trim(),
					name: $el.find('td:nth-child(2)').text().trim(),
					crunchbase_url: $el.find('td:nth-child(2) a').attr('href'),
					company_url: $el.find('td:nth-child(3) a:nth-child(1)').attr('href'),
					accelerator_url: $el.find('td:nth-child(4) a').attr('href'),
					exit_value: $el.find('td:nth-child(5)').text().replace('$', '').trim(),
					funding: $el.find('td:nth-child(7)').text().replace('$', '').trim(),
					employees: $el.find('td:nth-child(8)').text().trim(),
					rounds: $el.find('td:nth-child(9)').text().replace('$', '').trim(),
					country_code: $el.find('td:nth-child(11)').text().replace('$', '').trim()
				}
			}).get();
			return companies;
		});
		return resultsPromise;
	})
};

// Commands.accelerator_companies.run({accelerator_id: 1011})
//   .then(function(res) {
//     console.log("res", res.reverse());
//   })
//   .catch(function (err) {
//     console.log("err with command", err)
//   })

module.exports = Commands;