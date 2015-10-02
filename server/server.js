if(Meteor.settings.MAIL_URL)
    process.env.MAIL_URL = Meteor.settings.MAIL_URL;
if(Meteor.settings.twilio)
    SMS.twilio = {ACCOUNT_SID:Meteor.settings.twilio.sid,
        AUTH_TOKEN:Meteor.settings.twilio.auth_token,
        NUMBER: Meteor.settings.twilio.number
    };

//Email.send({
//   from:"byrne.yan@yahoo.com",
//    to:"byrne.jb.yan@gmail.com",
//    subject: "Test mail sent from Meteor by YahooMail",
//    text:"This is a email for tests purpose from Meteor via YahooMail"
//});

//WebApp.connectHandlers.use(function(req,res,next){
//    console.log('WebApp.connectHandlers.use');
//    res.setHeader("Access-Control-Allow-Origin","*");
//
//    res.setHeader("Access-Control-Allow-Headers",[
//       'Accept',
//        'Accept-Charset',
//        'Accept-Encoding',
//        'Accept-Language',
//        'Accept-Datetime',
//        'Cache-Control',
//        'Connection',
//        'Cookie',
//        'Content-Length',
//        'Content-MD5',
//        'Content-Type',
//        'Date',
//        'User-Agent',
//        'X-Requested-With',
//        'Origin'
//    ].join(', '));
//});
Meteor.startup(function () {
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