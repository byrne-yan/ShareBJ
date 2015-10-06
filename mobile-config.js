App.info({
   id:"info.hy-cloud.sharebj",
    name: 'sharebj',
    description: 'Shared Baby Journals',
    author: 'Byrne Yan',
    email: 'yanjb@hy-cloud.info',
    website: 'http://sharebj.hy-cloud.info'
});
App.setPreference('AllowInlineMediaPlayback',true);

App.setPreference('android-windowSoftInputMode',"stateVisible|adjustResize");
//

App.accessRule("*");

//App.accessRule("*://localhost/*");
//App.accessRule("*://localhost:8080/*");
//App.accessRule("cdvfile:*");
//App.accessRule('*:/*/*.(jpg|png)',{launchExternal:false});