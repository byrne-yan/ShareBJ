process.env.MAIL_URL = Meteor.settings.MAIL_URL;

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