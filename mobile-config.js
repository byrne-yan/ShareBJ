App.info({
   id:"cn.hystudio.sharebj",
    name: 'sharebj',
    description: 'Shared Baby Journals',
    author: 'Byrne Yan',
    email: 'byrne.yan@yahoo.com',
    website: 'http://sharebj.hystudio.cn'
});
App.setPreference('AllowInlineMediaPlayback',true);

App.setPreference('android-windowSoftInputMode',"stateVisible|adjustResize");
//

App.accessRule("*");

//App.accessRule("*://localhost/*");
//App.accessRule("*://localhost:8080/*");
//App.accessRule("cdvfile:*");
//App.accessRule('*:/*/*.(jpg|png)',{launchExternal:false});