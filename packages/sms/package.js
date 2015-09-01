Package.describe({
  name: 'sbj:sms',
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
      'http@1.1.0',
      'random@1.0.3',
    'abhiaiyer:meteor-twilio@0.0.5',
    'sbj:lib'
  ];

  api.use(packages);
    api.imply(packages);

  api.addFiles([
      'lib/server/sms.js',
      'lib/server/twilio.js',
      'lib/server/haoservice.js'
  ],['server']);

    api.export([
        'SMSDeliver',
        'SMS'
    ]);
});

Package.onTest(function(api) {
  api.use([
    'sanjo:jasmine@0.18.0',
    'coffeescript@1.0.6',
      'sbj:sms'
      ]);

    api.addFiles('tests/jasmine/server/unit/sms_spec.js','server');
    api.addFiles('tests/jasmine/server/integration/sms_spec.js','server');

});
