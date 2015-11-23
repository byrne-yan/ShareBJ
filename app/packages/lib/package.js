Package.describe({
  name: 'sbj:lib',
  version: '0.1.0',

  summary: 'ShareBJ base library',

  git: 'https://git.oschina.net/vamp/ShareBJ.git',
  documentation: 'README.md'
});

Cordova.depends({
    //"org.apache.cordova.camera": "0.3.0",
    //"cordova-plugin-imagepicker":"1.2.2",
    //"com.synconset.ImagePickerExt":"https://github.com/ratkop/-cordova-imagePickerEx/tarball/54c04c84bba39764a8dfc1a320a6bed3861a874e",
    "th.co.snowwhite.imagepicker":"https://github.com/mattchete/snw-cordova-imagePicker/tarball/cd075bda6470d594816bd63c1a50d99ba62d6b26",
    "cordova-plugin-camera":'1.2.0',

    "cordova-plugin-file":"3.0.0",
    "cordova-plugin-file-transfer":"1.3.0",
    "cordova-plugin-chrome-apps-system-memory":"1.1.1",
    //"cordova-plugin-globalization":"1.0.1"
    //"cordova-plugin-sim":"1.0.2",
    //"cordova-plugin-contacts":"1.1.0",
    //"cordova-plugin-device":"1.0.1"
    //'cordova-plugin-crosswalk-webview': '1.3.1'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');
    var packages =[
        'ecmascript',
        'meteor-platform@1.2.2',
        'angular@1.0.3',
        'momentjs:moment@2.10.6',
        'accounts-password@1.1.1',
        //'angularui:angular-ui-router@0.2.15',
        //'aldeed:simple-schema@1.3.3',
        //'aldeed:collection2@2.3.3',
        //'sacha:autoform@5.1.2',
        'matb33:collection-hooks@0.8.0',
        'driftyco:ionic@1.1.0_1',
        //'jonmc12:ionic-material@0.4.2_1',
        'edgee:slingshot@0.7.1-test',
        'angular:angular-messages@1.4.2',
        //'ccorcos:clientside-image-manipulation@1.0.4',
        'sbj:clientside-image-manipulation@1.0.4',
        'tmeasday:publish-counts@0.7.1',
        'http'
        //,'sbj:cordova-file-server@0.1.3'
        //'natestrauser:cordova-file-server@0.1.2'

    ];

    api.use(packages);
    api.imply(packages);

    api.addFiles([
        'lib/base.js',
        'lib/core.js',
        'lib/callbacks.js',
        //'lib/collections.js',
        'lib/moment_locale_zh_cn.js',
        'lib/age.js',
        'lib/net.js'
    ],['server','client']);

    api.addFiles([
        'server/aws.js',
        'server/verification.js',
        'server/net_server.js'
    ],   ['server']);

    api.addFiles([
        'client/lib.ng.js',
        'client/ngletteravatar.js',
        'client/photos.js',
        //'client/directive/slidebox_directive.ng.html',
        //'client/directive/slidebox_directive.ng.js',
        'client/directive/autosize_directive.ng.js',
        'client/style.css',
        'client/net_client.js'
        ],   ['client']);

    api.export('ShareBJ');
    api.export('conceptionAge');
    api.export('ageOf');
    api.export('clone');
    api.export('LocalCollection','client');
    api.export('SBJ_DEBUG');

    //testing purpose
    api.export('_lib_methods4Testing')

});

Package.onTest(function(api) {
    api.use([
        'sanjo:jasmine@0.20.2',
        'sbj:lib'
    ]);

    api.addFiles([
        'tests/jasmine/client/net_spec.js'
    ],'client');

    api.addFiles([
        'tests/jasmine/lib_spec.js',
        'tests/jasmine/net_spec.js',
        'tests/jasmine/age_spec.js'
        ],['client','server']);
});
