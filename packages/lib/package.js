Package.describe({
  name: 'sbj:lib',
  version: '0.1.0',

  summary: 'ShareBJ base library',

  git: 'https://git.oschina.net/vamp/ShareBJ.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');
    var packages =[
        'meteor-platform@1.2.2',
        'urigo:angular@0.9.3',
        'momentjs:moment@2.10.3',
        'accounts-password@1.1.1',
        'angularui:angular-ui-router@0.2.15',
        'aldeed:simple-schema@1.3.3',
        'aldeed:collection2@2.3.3',
        'sacha:autoform@5.1.2',
        'matb33:collection-hooks@0.7.11'
    ];

    api.use(packages);
    api.imply(packages);

    api.addFiles([
        'lib/base.js',
        'lib/core.js',
        'lib/callbacks.js',
        'lib/collections.js'
    ],['server','client']);

    api.addFiles([
        'client/lib.js'//,
        //'client/helpers/stylesheet.css'
        ],   ['client']);

    api.export('ShareBJ');

});

Package.onTest(function(api) {
    api.use([
        'sanjo:jasmine@0.15.1',
        'coffeescript',
        'sbj:lib'
    ]);

    api.addFiles('tests/jasmine/client/libSpec.coffee',['client']);

    api.addFiles('tests/jasmine/lib_spec.coffee',['client','server']);
});
