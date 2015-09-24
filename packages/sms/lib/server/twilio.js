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
            body:message,
            StatusCallback:process.env.ROOT_URL+'smshook'
        }, function(err,sms){
            if(err){
                callback(err);
            }else{
                callback(null,{messageId:sms.sid,status:sms.status});
            }
        });
    },
    queryMessageStatus:function(messageId,callback){
        this._twilioClient.getMessage(messageId,function(err,message){
            if(err){
                callback(err);
            }else{
                callback(null,message.status);
            }
        })
    }


};

SMSDeliver.registerProvider('twilio',new TwilioProvider());



