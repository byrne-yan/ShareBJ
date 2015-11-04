Package.describe({
  name: 'sbj:avatar',
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
  api.versionsFrom('1.2.0.1');
  api.use([
      'meteor-base',
      'mongo',
        'ecmascript',
        'random',
        'sbj:lib',
      'jonblum:jquery-cropper@1.0.0'

  ]);
  api.addFiles('lib/avatar.js');

  api.addFiles([
      'lib/client/avatar.ng.js',
    //'lib/client/upload.js',
    'lib/client/directive/avatar_directive.ng.html',
    'lib/client/directive/avatar_directive.ng.js',
      'lib/client/style.css'
    ], 'client');

  //api.addFiles([
  //      'lib/server/upload.js',
  //        'lib/server/avatar_methods.js'
  //    ]
  //    ,'server');
    api.export('Avatars');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('sbj:fixtures');
    api.use("accounts-password");
    api.use("random");
  api.use('sanjo:jasmine@0.20.2');

  api.use('sbj:avatar');
  api.addFiles('tests/jasmine/client/upload_sepc.js','client');
});
