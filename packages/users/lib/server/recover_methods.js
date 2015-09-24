Meteor.methods({
    searchAccount: function (identity) {
        check(identity, String);
        var selector = {
            $or: [
                {'username': identity},
                {'emails.address': identity},
                {'phone.number': identity},
                {'profile.name': identity}
            ]
        };
        var options = {
            fields: {
                username: 1, 'phone.number': 1, 'profile.name': 1, 'emails': 1, avatar: 1
            },
            transform: function (user) {
                if (user.phone.number)
                    user.phone.number = user.phone.number.replace(/(\d*)(\d{4})(\d{4})/, function (match, p1, p2, p3) {
                        return [p1, '****', p3].join('');
                    });
                if(user.emails && user.emails[0]){
                    console.log(user.emails[0].address);
                    user.emails[0].address = user.emails[0].address.replace(/(.)(.*)(.)(@)(.*)/, function (match, p1, p2, p3,p4,p5) {
                        var np = Array.apply(null,Array(p2.length)).map(function(){return '*'}).join('');
                        return [p1, np, p3,p4,p5].join('');
                    });
                    console.log(user.emails[0].address);
                }
                return user;
            }
        };
        var user = Meteor.users.findOne(selector, options);
        if(!user)
            throw new Meteor.Error(400,'User not found');
        return user;
    },
    sendResetSMSVerify:function(userId){
        check(userId,String);
        var err = ShareBJ.sendResetVerifyCodeSMS(userId);
        if(err)
            throw new Meteor.Error(400,err);
    },
    sendResetEmailVerify:function(userId){
        check(userId,String);
        //this.unblock();
        try{
            ShareBJ.sendResetVerifyCodeEmail(userId);
        }catch(err){
            throw new Meteor.Error(500,err.message);
        }
    },
    validateResetVerify:function(userId,verifyCode){
        check(userId,String);
        check(verifyCode,String);
        //check(options,{type:["phone","email","unknown"]});

        //if(options.type==="phone"){
        //
        //}
        var err = ShareBJ.validateResetVerify(userId,verifyCode);
        if(err)
            throw new Meteor.Error(400,err.message);
    },
    setMyPassword: function(userId,verifyCode,password){
        check(userId,String);
        check(verifyCode,String);
        check(password,String);
        try{
            var err =ShareBJ.validateResetVerify(userId,verifyCode,{remove:true});
            if(err)
                throw new Meteor.Error(401,err.message);

            Accounts.setPassword(userId,password,{logout:false});
        }catch(err){
            throw new Meteor.Error(500,err.message);
        }
    }
});