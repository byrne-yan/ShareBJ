if(Meteor.settings.MAIL_URL)
    process.env.MAIL_URL = Meteor.settings.MAIL_URL;

Meteor.startup(function () {
    if(!Meteor.users.findOne({}))
        Users.createAdminAccount();

    // BrowserPolicy._setRunningTest();
    console.log('defual csp:',BrowserPolicy.content._constructCsp());
    BrowserPolicy.content.allowSameOriginForAll();
    BrowserPolicy.content.allowOriginForAll("http://meteor.local");
    BrowserPolicy.content.allowOriginForAll("blob:");
    BrowserPolicy.content.allowOriginForAll("file://*");
    BrowserPolicy.content.allowOriginForAll(process.env.ROOT_URL);
    BrowserPolicy.content.allowOriginForAll("https://*.amazonaws.com");
    BrowserPolicy.content.allowOriginForAll("https://*.amazonaws.com.cn");
    BrowserPolicy.content.allowEval();
    console.log('setted csp:',BrowserPolicy.content._constructCsp());
    // BrowserPolicy.content.disallowAll();
    //console.log(Meteor.settings);
    //console.log(SMS);
    //if(Meteor.settings.sms && Meteor.settings.sms.provider)
    //    SMSDeliver.setProvider(Meteor.settings.sms.provider);
});

Meteor.onConnection(function(conn){
    console.log("onconnection:",conn.id,conn.clientAddress);
});