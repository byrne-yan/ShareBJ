Package.describe({
  name: 'sbj:fixtures',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
    debugOnly:true,
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use([
     'meteor-base',
      'accounts-password'/*,
      'sbj:avatar'*/
      ,'edgee:slingshot@0.7.1-test',
      'sbj:babies',
      'sbj:journals'
  ]);
  api.addFiles('fixtures.js','server');
    api.addFiles('helpers.js');
    api.addFiles('server_helpers.js','server');
    api.addFiles('Blob.js');

    api.export('TestStorageService');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('sbj:fixtures');

  api.addFiles('fixtures-tests.js');

});
