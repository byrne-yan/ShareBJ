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
        'sbj:babies',
        'sbj:images',
        'sbj:ng-cordova'
    ];

    api.use(packages);

    api.imply(packages);

    api.addFiles([
            'lib/journals.js'
        ], ['client','server']
    );

  api.addFiles([
          'lib/client/style.css',
          'lib/client/directive/journal_directive.css',
        'lib/client/app.ng.js',
        'lib/client/journals.ng.js',
          'lib/client/new_journal.ng.js',
        'lib/client/router.ng.js',

          'lib/client/journals_main.ng.html',
          'lib/client/new_journal.ng.html',
        'lib/client/journals.ng.html',
          'lib/client/directive/journal_directive.ng.html',
          'lib/client/directive/journal_directive.ng.js',
          'lib/client/input_popover.ng.html'
      ], ['client']
  );

  api.addFiles([
          'lib/server/publications.js',
          'lib/server/journals_securities.js',
          'lib/server/journals_methods.js'
      ], ['server']
  );


    api.export('Journals');
});

Package.onTest(function(api) {
  api.use([
    'sanjo:jasmine@0.20.2',
    'sbj:journals',
      'sbj:fixtures'
  ]);

    api.addFiles('tests/jasmine/client/journals_spec.js', 'client');
    //api.addFiles('tests/jasmine/server/journals_spec.js', 'server');
});
