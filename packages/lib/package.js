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
        'angular',
        'momentjs:moment@2.10.6',
        'accounts-password@1.1.1',
        //'angularui:angular-ui-router@0.2.15',
        'aldeed:simple-schema@1.3.3',
        'aldeed:collection2@2.3.3',
        'sacha:autoform@5.1.2',
        'matb33:collection-hooks@0.7.13',
        'driftyco:ionic@1.1.0',
        //'jonmc12:ionic-material@0.4.2_1',
        'edgee:slingshot@0.7.1',
        'angular:angular-messages@1.4.2',
        'tmeasday:publish-counts@0.6.0'

    ];

    api.use(packages);
    api.imply(packages);

    api.addFiles([
        'lib/base.js',
        'lib/core.js',
        'lib/callbacks.js',
        'lib/collections.js',
        'lib/moment_locale_zh_cn.js',
        'lib/age.js'
    ],['server','client']);

    api.addFiles([
        'server/aws.js'//,
        //'client/helpers/stylesheet.css'
    ],   ['server']);

    api.addFiles([
        'client/lib.ng.js',
        'client/style.css'
        //'client/helpers/stylesheet.css'
        ],   ['client']);

    api.export('ShareBJ');
    api.export('conceptionAge');
    api.export('ageOf');

});

Package.onTest(function(api) {
    api.use([
        'sanjo:jasmine@0.16.0',
        'coffeescript',
        'sbj:lib'
    ]);

    api.addFiles('tests/jasmine/client/libSpec.coffee',['client']);

    api.addFiles('tests/jasmine/lib_spec.coffee',['client','server']);
});
