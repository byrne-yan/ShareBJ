Package.describe({
  name: 'sbj:users',
  summary: 'ShareBJ permissions.',
  version: '0.1.0',
  git: "https://git.oschina.net/vamp/ShareBJ.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.1']);

    var packages =[
        'sbj:lib@0.1.0'
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
     'lib/client/app.ng.js',
    'lib/client/users_router.ng.js',

    'lib/client/stylesheet.css',

    'lib/client/login/login.ng.js',
    'lib/client/login/login.ng.html',

    'lib/client/signup/signup.ng.js',
    'lib/client/signup/signup.ng.html',

    'lib/client/user/user.ng.js',
    'lib/client/user/user.ng.html',
    'lib/client/user/name_edit.ng.html',
    'lib/client/user/email.ng.js',
    'lib/client/user/email_edit.ng.html',
    'lib/client/user/mobile_edit.ng.html'


  ], ['client']);

  api.addFiles([
      'lib/server/email.js',
    'lib/server/users.js',
    'lib/server/publications.js'
  ], ['server']);

  //api.export('Users');
    api.export('Babies');
});

Package.onTest(function(api){
  //add package dependencies

  api.use([
    'sanjo:jasmine@0.16.0',
    'coffeescript@1.0.6',
    'angular:angular-mocks@1.4.2',
    'sbj:users'
  ]);
    //api.addFiles('index.html');
  api.addFiles('tests/jasmine/client/users_spec.coffee',['client']);
  api.addFiles('tests/jasmine/server/users_spec.coffee',['server']);
  api.addFiles('tests/jasmine/users_spec.coffee',['client','server']);

});
