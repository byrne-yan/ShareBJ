ShareBJ.genDigitalCode = function(length){
    var code = new Array(length);

    for(;length>0;length--)
        code[length] = Random.choice([1,2,3,4,5,6,7,8,9]);
    return code.join('');
};

ShareBJ.genResetVerifyCode = function(userId){
    var user = Meteor.users.findOne({_id: userId});
    if(user){
        if(user.services.verification && user.services.verification.code){
            var expireDate = moment(user.services.verification.when).add(30,"minitues").toDate();
            var now = new Date();
            if( now <= expireDate){
                return null;
            }
            //remove it
            Meteor.users.update({_id:userId},{$unset:{'services.verification':""}})
        }
        var code = ShareBJ.genDigitalCode(6);
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
    var sendMessageSync = Meteor.wrapAsync(SMSDeliver.sendMessage,SMSDeliver);

    var messageId = sendMessageSync('某人最近请求复位你的ShareBJ密码,你可以输入确认码'+user.services.verification.code+'复位密码',user.phone.number,{});
    Meteor.users.update({_id: userId},{$set:{'services.verification.sentBySMS':[{when:new Date(),messageId:messageId}]}});
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
        var expireDate = moment(user.services.verification.when).add(30,"minutes").toDate();
        var now = new Date();
        if( now <= expireDate){
            if(option && option.remove){
                Meteor.users.update({_id:userId},{$unset:{'services.verification':""}});
            }
            return null;
        }
    }
    return new Error('Verify code expired');
};