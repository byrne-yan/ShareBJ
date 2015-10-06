Package.describe({
  name: 'sbj:users',
  summary: 'ShareBJ permissions.',
  version: '0.1.0',
  git: "https://github.com/byrne-yan/ShareBJ.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.1']);

    var packages =[
        'sbj:lib',
        'riaan53:blueimp-canvas-to-blob@0.0.1',
        //'okland:accounts-phone@0.0.21',
        'sbj:accounts-phone@0.0.21',
        'sbj:sms',
        'sbj:notifications',
        'sbj:avatar'
    ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/users.js',
    'lib/user_invitations.js',
    'lib/user_limits.js'
  ], ['client', 'server']);

  api.addFiles([
     'lib/client/app.ng.js',
    'lib/client/users_router.ng.js',

    'lib/client/stylesheet.css',

      'lib/client/users_main.ng.html',
    'lib/client/login/login.ng.js',
    'lib/client/login/login.ng.html',

    'lib/client/signup/signup.ng.js',
    'lib/client/signup/signup.ng.html',
    'lib/client/signup/signup_with_phone.ng.html',
      'lib/client/signup/signup_with_email.ng.html',

    'lib/client/user/user.ng.js',
    'lib/client/user/user.ng.html',
    'lib/client/user/name_edit.ng.html',
    'lib/client/user/motto_edit.ng.html',
    'lib/client/user/email.ng.js',
    'lib/client/user/email_edit.ng.html',
    'lib/client/user/mobile/mobile_edit.ng.html',
    'lib/client/user/mobile/mobile_edit.ng.js',
    'lib/client/user/user_summary.ng.html'
     ,'lib/client/user/notifications.ng.js'
     ,'lib/client/user/notifications.ng.html'
    ,'lib/client/user/user_change_password.ng.html'
    ,'lib/client/user/user_change_password.ng.js'
    ,'lib/client/recover/recover.ng.js'
    ,'lib/client/recover/recover.ng.html'
    ,'lib/client/recover/recover_select.ng.html'
    ,'lib/client/recover/recover_email.ng.html'
    ,'lib/client/recover/recover_phone.ng.html'
    ,'lib/client/recover/recover_set_password.ng.html'


  ], ['client']);

  api.addFiles([
    'lib/server/email.js',
    'lib/server/users_security.js',
    'lib/server/users_methods.js',
    'lib/server/recover_methods.js',
    'lib/server/publications.js'
  ], ['server']);

  api.export('Users');
  api.export('UserInvitations');

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
