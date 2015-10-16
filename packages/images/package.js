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

Npm.depends({
  "aws-sdk":'2.2.4'
});
Cordova.depends({
    "com.rjfun.cordova.httpd":"file://../cordova-plugins/cordova-httpd",
    "com.raananw.imageResizer":"https://github.com/RaananW/PhoneGap-Image-Resizer/tarball/708b0091048a9f494e7efed7bf0ca2002501d66a"
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
    const impliables = ['edgee:slingshot@0.7.1-test'];
  api.use([
      'ecmascript',
      'meteor-base',
      'mongo',
      "random",
      'reactive-var',
      'sbj:lib',
      'sbj:users'
    ]);
    api.use(impliables);
    api.imply(impliables);
  api.addFiles('lib/images.js');

  api.addFiles([
      'lib/client/images_client.js',
      'lib/client/image_cache.js',
      'lib/client/upload_client.js',
      'lib/client/upimage.js',
      'lib/client/image_server.js',
      'lib/client/images.ng.js',
      'lib/client/router.ng.js',
      'lib/client/directive/imageslides_directive.ng.html',
      'lib/client/directive/imageslides_directive.ng.js',
      'lib/client/directive/imageslides_directive.css',
      'lib/client/directive/thumbnail_directive.ng.html',
      'lib/client/directive/thumbnail_directive.ng.js',

      'lib/client/uploading_menu.ng.html',
      'lib/client/uploading_dashboard.ng.html'
  ],'client');

  api.addFiles([
    'lib/server/s3_upload.js',
    'lib/server/s3_security.js'
    ],'server');
  api.export('Images');
    api.export('Uploads');
    api.export('UpImage');


});

Package.onTest(function(api) {
    api.use([
        'ecmascript',
        'sanjo:jasmine@0.20.0',
        'accounts-base',
        'accounts-password',
        "random",
        'reactive-var',
        'sbj:lib',
        'sbj:images',
        'sbj:fixtures'
    ]);
    api.addFiles('tests/jasmine/client/images-specs.js','client');
});
