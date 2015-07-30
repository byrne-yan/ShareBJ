Package.describe({
  name: 'sbj:journals',
  version: '0.1.0',

  summary: 'journal related features',

  git: 'https://github.com/byrne-yan/ShareBJ.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

    api.versionsFrom(['METEOR@1.1']);

    var packages =[
        'sbj:lib',
        'sbj:users'
    ];

    api.use(packages);

    api.imply(packages);

  api.addFiles([
        'lib/client/app.js',
        'lib/client/router.ng.js',

        'lib/client/journals.ng.html',
        'lib/client/journals.ng.js',
      ], ['client']
  );
  api.addFiles([
        'lib/server/publications.js'
      ], ['server']
  );

  api.addFiles([
      'lib/journals.js'
      ], ['client','server']
  );
    //api.export(Journals);
});

Package.onTest(function(api) {
  api.use([
    'sanjo:jasmine@0.15.1',
    'coffeescript@1.0.6',
    'angular:angular-mocks@1.4.2',
    'sbj:journals'
  ]);

  //api.addFiles('journals_specs.coffee');

});
