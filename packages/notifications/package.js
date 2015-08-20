Package.describe({
  name: 'sbj:notifications',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  var packages = [
    'kestanous:herald@1.3.0'
    ,'kestanous:herald-email@0.5.0',
      'sbj:lib'
    //,'kestanous:herald-web-nitifications@0.4.0'
  ];
  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/herlad.js',
    'lib/notifications.js'
    ], ['client','server']);

  api.export('Herald');


});

Package.onTest(function(api) {
  //api.use('tinytest');
  api.use('sbj:notifications');
  //api.addFiles('notifications-tests.js');
});
