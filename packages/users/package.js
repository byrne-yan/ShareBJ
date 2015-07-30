Package.describe({
  name: 'sbj:users',
  summary: 'ShareBJ permissions.',
  version: '0.1.0',
  git: "https://git.oschina.net/vamp/ShareBJ.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.1']);

    var packages =[
        'sbj:lib@0.1.0',
        'urigo:ionic@1.0.0_1',
        'jonmc12:ionic-material@0.4.2_1',
        'angular:angular-messages@1.4.2'
    ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/users.js',
      'lib/babies.js'
    //'lib/publications.js',
    //'lib/methods.js'
  ], ['client', 'server']);

  api.addFiles([
     'lib/client/app.js',
    'lib/client/users_router.js',

    'lib/client/stylesheet.css',

    'lib/client/login/login.ng.js',
    'lib/client/login/login.ng.html',

    'lib/client/signup/signup.ng.js',
    'lib/client/signup/signup.ng.html'

  ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
    //'lib/server/create_user.js'
  ], ['server']);

  //api.export('Users');
    api.export('Babies');
});

Package.onTest(function(api){
  //add package dependencies

  api.use([
    'sanjo:jasmine@0.15.1',
    'coffeescript@1.0.6',
    'angular:angular-mocks@1.4.2',
    'sbj:users'
  ]);
    //api.addFiles('index.html');
  api.addFiles('tests/jasmine/client/users_spec.coffee',['client']);
  api.addFiles('tests/jasmine/server/users_spec.coffee',['server']);
  api.addFiles('tests/jasmine/users_spec.coffee',['client','server']);

});
