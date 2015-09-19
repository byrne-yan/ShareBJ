Package.describe({
  name: 'sbj:images',
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
  api.versionsFrom('1.1.0.2');
  api.use([
      'meteor-base',
      'mongo',
    'edgee:slingshot@0.7.1'
  ]);

  api.addFiles('lib/images.js');

  api.addFiles('lib/client/upload_client.js','client');

  api.addFiles([
    'lib/server/s3_upload.js',
    'lib/server/s3_security.js'
    ],'server');
  api.export('Images');

});

//Package.onTest(function(api) {
//  api.use('tinytest');
//  api.use('sbj:images');
//  //api.addFiles('images-tests-bak.js');
//});
