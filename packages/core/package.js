Package.describe({
  name: 'sbj:core',
  version: '0.0.1',

  summary: 'ShareBJ cores',
  git: 'https://git.oschina.net/vamp/ShareBJ.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
     'sbj:lib@0.0.1'
  ]);
  api.addFiles('core.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('sbj:core');
  api.addFiles('core-tests-bak.js');
});
