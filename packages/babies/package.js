Package.describe({
  name: 'sbj:babies',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'babies',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/byrne-yan/ShareBJ.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  var packkges = [
    'sbj:lib'
  ];

  api.use(packkges);
  api.imply(packkges);

  api.addFiles([
    'lib/requests.js',
    'lib/babies.js'
  ],['client','server']);

  api.addFiles([
      'lib/client/app.ng.js',
      'lib/client/new.ng.js',
      'lib/client/route.ng.js',
      'lib/client/new.ng.html',
      'lib/client/babies_main.ng.html',
    'lib/client/babies_list.ng.html',
    'lib/client/babies_list.ng.js',
      'lib/client/baby_menu.ng.html',
    'lib/client/baby_menu.ng.js',
    'lib/client/babies_requests.ng.js',
    'lib/client/babies_requests.ng.html'
  ],'client');

  api.addFiles([
      'lib/server/babies_methods.js',
    'lib/server/requests_methods.js',
    'lib/server/babies_securities.js',
      'lib/server/publications.js'
  ],'server');



  api.export('Babies');
  api.export('Requests');
  api.export('Baby');
});

Package.onTest(function(api) {
  api.use([
    'sanjo:jasmine@0.16.0',
    'coffeescript@1.0.6',
    'angular:angular-mocks@1.4.2',
    'sbj:babies'
  ]);

});
