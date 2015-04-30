var BC = require('big-cheese');
var DataSource = BC.DataSource;
var Browser = require('zombie')
ONE_SECOND = 1;
ONE_DAY = ONE_SECOND*60*60*24

var DataSources = {
	seeddb: {
		accelerator_companies: DataSource('seeddb_accelerator_companiees', ONE_DAY, function (opts, done) {
			if (! opts.accelerator_id) {
				done(new Error("No accelerator id provided."));
			}
			var base_url = "http://www.seed-db.com";
			var page_url = "/accelerators/view?acceleratorid="+opts.accelerator_id;
			var b = new Browser({site: base_url, waitDuration: '30s'});
			b.visit(page_url)
				.then(function () {
					b.wait({element: '#accellist'}, function (err, browser) {
						if (err) {
							done(err);
							return;
						}
						var html = b.html();
						b.destroy();
						done(null, html);
					});
				})
				.catch(function (err) {
					b.destroy();
					done(err);
				});
		}),
		accelerators: DataSource('seeddb_accelerators', ONE_DAY, function (opts, done) {
			var base_url = "http://www.seed-db.com";
			var page_url = "/accelerators/all";
			var b = new Browser({site: base_url, waitDuration: '30s'});
			b.visit(page_url)
				.then(function () {
					b.wait({element: '#accellist'}, function (err, browser) {
						if (err) {
							done(err);
							return;
						}
						var html = b.html();
						b.destroy();
						done(null, html);
					});
				})
				.catch(function (err) {
					b.destroy();
					done(err);
				});
		}),
		exits: DataSource('seeddb_exits', ONE_DAY, function (opts, done) {
			var base_url = "http://www.seed-db.com";
			var page_url = "/companies/funding?value=exit";
			var b = new Browser({site: base_url, waitDuration: '30s'});
			b.visit(page_url)
				.then(function () {
					b.wait({element: '#seedcos'}, function (err, browser) {
						if (err) {
							done(err);
							return;
						}
						var html = b.html();
						b.destroy();
						done(null, html);
					});
				})
				.catch(function (err) {
					b.destroy();
					done(err);
				});
		})
	}
};

module.exports = DataSources;