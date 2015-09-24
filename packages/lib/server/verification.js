ShareBJ.SMSValidTime =  1000 * 15 * 60; //15 minutes
ShareBJ.SMSSendWaitTime = 60*1000;
ShareBJ.SMSCodeLength = 6;

ShareBJ.genDigitalCode = function(length){
    var code = new Array(length);

    for(;length>0;length--)
        code[length] = Random.choice([1,2,3,4,5,6,7,8,9]);
    return code.join('');
};

ShareBJ.genResetVerifyCode = function(userId){
    var user = Meteor.users.findOne({_id: userId});
    if(user){
        if(user.services.verification && user.services.verification.code && user.services.verification.when){
            var now = new Date();
            if( now.getTime() - user.services.verification.when.getTime() < ShareBJ.SMSValidTime){ //still valid, no need generation
                return null;
            }
            //remove it
            Meteor.users.update({_id:userId},{$unset:{'services.verification':""}})
        }
        var code = ShareBJ.genDigitalCode(ShareBJ.SMSCodeLength);
        Meteor.users.update({_id:userId},{$set:{'services.verification':{code:code,when:new Date()}}});
        return null;
    }else{
        return new Error('User not found');
    }
};

ShareBJ.sendResetVerifyCodeSMS = function(userId){
    var err = ShareBJ.genResetVerifyCode(userId);
    if(err) return err;

    var user = Meteor.users.findOne({_id: userId});
    if(!user)
        return "User not found";

    var now = new Date();
    var smsStatus = user.services.verification.sentBySMS;
    if(smsStatus )
    {
        if(smsStatus.status=="delivered"){
            return "Already delivered";
        }

        if(now.getTime() - smsStatus.when.getTime() < ShareBJ.SMSSendWaitTime)
        {
            return "Send too often";
        }
    }

    var sendMessageSync = Meteor.wrapAsync(SMSDeliver.sendMessage,SMSDeliver);
    var result = sendMessageSync('-ShareBJ: 最近有人请求复位你的密码,你可以输入确认码 '
        +user.services.verification.code+' 复位密码。此码'
        +ShareBJ.SMSValidTime/1000/60+'分钟内有效。发送时间：'+moment.utc().format('LT'),user.phone.number,{});

    if(result)
    {
        Meteor.users.update({_id: userId},{$set:{'services.verification.sentBySMS':[{when:new Date(),messageId:result.messageId,status:result.status}]}});
    }
};

ShareBJ.sendResetVerifyCodeEmail = function(userId){
    var err = ShareBJ.genResetVerifyCode(userId);
    if(err) return err;

    var user = Meteor.users.findOne({_id: userId});
    Email.send({
        from: 'byrne_yan@yahoo.com',
        to:user.emails[0].address,
        html:'<p>某人最近请求复位你的ShareBJ密码。<p>' +
            '<a href="'+process.env.ROOT_URL+'/login/recover/password?userId='+user._id+'&verify='+user.services.verification.code+'">点击这修改你的密码</a>'+
            '<p>或者，你可以输入以下密码复位确认码：</p>' +
            '<center>'+user.services.verification.code+'</center>'
    });

    Meteor.users.update({_id: userId},{$set:{'services.verification.sentByEmail':[{when:new Date()}]}});
};

ShareBJ.validateResetVerify = function(userId,verifyCode,option){
    var user = Meteor.users.findOne({_id: userId});
    if(!user) return new Error('User not found');

    if(user.services.verification && user.services.verification.code===verifyCode){
        var now = new Date();
        if( now.getTime()-user.services.verification.when.getTime() < ShareBJ.SMSValidTime){
            if(option && option.remove){
                Meteor.users.update({_id:userId},{$unset:{'services.verification':""}});
            }
            return null;
        }
    }
    return new Error('Verify code expired');
}