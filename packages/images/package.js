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
  "aws-sdk":'2.2.12'
});
Cordova.depends({
    "com.rjfun.cordova.httpd":"file://../cordova-plugins/cordova-httpd",
    //"com.raananw.imageResizer":"https://github.com/RaananW/PhoneGap-Image-Resizer/tarball/708b0091048a9f494e7efed7bf0ca2002501d66a",
    "com.raananw.imageResizer":"file://../cordova-plugins/RaananW-PhoneGap-Image-Resizer-708b009",
    "cordova-plugin-chrome-apps-common":"file://../cordova-plugins/cordova-plugin-chrome-apps-common",
    "cordova-plugin-background-app":"file://../cordova-plugins/cordova-plugin-background-app",
    "cordova-plugin-chrome-apps-system-storage":"file://../cordova-plugins/cordova-plugin-chrome-apps-system-storage"
    //"cordova-sqlite-storage":"https://github.com/litehelpers/Cordova-sqlite-storage/tarball/b467515205894cc9367824ac7086adb42cc5263b"
    //"cordova-sqlite-storage":"file://../cordova-plugins/Cordova-sqlite-storage-0.7.7"
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
      'http',
      //'ground:db@1.0.0-alpha.3',
      'ground:db@0.3.0',
      'sbj:lib',
      'sbj:users'
    ]);
    api.use(impliables);
    api.imply(impliables);
  api.addFiles('lib/images.js');

  api.addFiles([
      'lib/client/images_client.js',
      'lib/client/cache/image_cache_index.js',
      'lib/client/cache/downloader.js',
      'lib/client/upload_client.js',
      'lib/client/upimage.js',
      'lib/client/image_web_server.js',
      'lib/client/images.ng.js',
      'lib/client/router.ng.js',
      'lib/client/images_dashboard.ng.js',
      'lib/client/images_dashboard.ng.html',
      'lib/client/images_settings.ng.html',
      'lib/client/images_list.ng.html',
      'lib/client/images.css',
      'lib/client/directive/imageslides_directive.ng.html',
      'lib/client/directive/imageslides_directive.ng.js',
      'lib/client/directive/imageslides_directive.css',
      'lib/client/directive/image_gallery.ng.js',
      'lib/client/directive/image_gallery.ng.html',
      'lib/client/directive/thumbnail_directive.ng.html',
      'lib/client/directive/thumbnail_directive.ng.js',

      'lib/client/images_menu.ng.html',
      'lib/client/uploading_dashboard.ng.html'
  ],'client');

  api.addFiles([
    'lib/server/s3_upload.js',
    'lib/server/s3_security.js'
    ],'server');
  api.export('Images');
    api.export('Uploads','client');
    api.export('UpImage','client');


});

Package.onTest(function(api) {
    api.use([
        'ecmascript',
        'sanjo:jasmine@0.20.2',
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
