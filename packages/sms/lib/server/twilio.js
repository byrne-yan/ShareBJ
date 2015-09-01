if(Meteor.settings.twilio)
{
    process.env.TWILIO_ACCOUNT_SID=Meteor.settings.twilio.sid;
    process.env.TWILIO_AUTH_TOKEN=Meteor.settings.twilio.auth_token;
}

TwilioProvider = function(){
    this.name = "twilio";
    this._twilioClient = Twilio();
};

TwilioProvider.prototype = {
    sendMessage: function(message, mobile, unused, callback){
        this._twilioClient.sendMessage({
            to: '+86' + mobile,
            from: Meteor.settings.twilio.number,
            body:message
        }, function(err,sms){
            if(err){
                callback(err,sms);
            }else{
                callback(null,sms.sid);
            }
        });
        //callack(err,sms)
        //sms:
        //{
        //    "account_sid": "AC8c6b9c6609a9cac8b6ba36e0e8b8ee79",
        //    "api_version": "2010-04-01",
        //    "body": "Jenny please?! I love you <3",
        //    "date_created": "Wed, 18 Aug 2010 20:01:40 +0000",
        //    "date_sent": null,
        //    "date_updated": "Wed, 18 Aug 2010 20:01:40 +0000",
        //    "direction": "outbound-api",
        //    "from": "+14158141829",
        //    "price": null,
        //    "sid": "SM90c6fc909d8504d45ecdb3a3d5b3556e",
        //    "status": "queued",
        //    "to": "+14159352345",
        //    "uri": "/2010-04-01/Accounts/AC8c6b9c6609a9cac8b6ba36e0e8b8ee79/SMSDeliver/Messages/SM90c6fc909d8504d45ecdb3a3d5b3556e.json"
        //}
    },
    queryMessageStatus:function(messageId,callback){
        this._twilioClient.listSms(messageId,function(err,message){
            if(err){
                callback(err,message);
            }else{
                callback(null,message.status);
            }
        })
    }


};

SMSDeliver.registerProvider('twilio',new TwilioProvider());



