
Meteor.methods({
    updateCurrentUserName: function(userId, name){
        check(userId,String);
        check(name,String);
        if(this.userId && userId === this.userId)
        {
            n = Meteor.users.update({_id:userId},
                {$set:{'profile.name':name}});
            if ( n !== 1){
                throw new Meteor.Error("Updating username fails");
            }
            return Meteor.users.findOne({_id:userId}).profile;
        }else{
            throw new Meteor.Error("Access Denied");
        }
    },
    updateCurrentUserEmail: function(userId, email){
        check(userId,String);
        check(email,String);
        if(this.userId && userId === this.userId)
        {
            n = Meteor.users.update({_id:userId},
                {$set:{'emails':[{address:email,verified:false}]}});
            if ( n !== 1){
                throw new Meteor.Error("Updating email fails");
            }
            this.unblock();
            try{
                Accounts.sendVerificationEmail(userId,email);
            }catch(err){
                throw new Meteor.Error(500,err.message);
            }

        }else{
            throw new Meteor.Error("Access Denied");
        }
    },

    updateCurrentUserMobile: function(userId, mobile){
        check(userId,String);
        check(mobile,String);
        if(this.userId && userId === this.userId)
        {
            //var existingUser = Meteor.users.findOne({'phone.number': mobile, 'phone.verified':true}, {fields: {'_id': 1}});
            //if(existingUser)
            //    throw new Meteor.Error(400,`Mobile already registered`);

            n = Meteor.users.update({_id:userId},
                {$set:{phone:{number:mobile,verified:false}}});
            if ( n !== 1){
                throw new Meteor.Error(500,"Updating mobile fails");
            }

            try{
                Accounts.sendPhoneVerificationCode(userId, mobile, {purpose:'bind'});
            }catch(e){
                throw new Meteor.Error(500,e.message);
            }
        }else{
            throw new Meteor.Error("Access Denied");
        }
    },
    updateCurrentUserAvatar: function(userId,avatarDataUrl){
        check(userId,String);
        check(avatarDataUrl,String);
        if(/^data\:image\/.*;base64,.*/g.test(avatarDataUrl)==false)
            throw new Meteor(400,"avatar must be DataUrl");

        if(this.userId && userId === this.userId)
        {
            n = Meteor.users.update({_id:userId},
                {$set:{'profile.avatar':avatarDataUrl}}
            );
            if ( n !== 1){
                throw new Meteor.Error("Updating avatar fails");
            }
        }else{
            throw new Meteor.Error("Access Denied");
        }
    },

    sendVerificationEmail: function(userId){
        if(this.userId === userId && Meteor.user().emails
            && Meteor.user().emails[0] && !Meteor.user().emails[0].verified)
        {
            Accounts.sendVerificationEmail(userId,Meteor.user().emails[0].address);
        }else{
            throw new Meteor.Error("Fail to send Verification Email.");
        }
    },
    updateCurrentUserMotto: function(userId, motto){
        check(userId,String);
        check(motto,String);
        if(this.userId && userId === this.userId)
        {
            n = Meteor.users.update({_id:userId},
                {$set:{'profile.motto':motto}});
            if ( n !== 1){
                throw new Meteor.Error("Updating motto fails");
            }
            return Meteor.users.findOne({_id:userId}).profile;
        }else{
            throw new Meteor.Error("Access Denied");
        }
    },
    'limits/uploadImages':function(userId){
        check(userId,String);
        if(this.userId && userId === this.userId){
            return getUploadLimits(userId);
        }
    },
    'signup/createUserByEmail':function(email,name){
        check(email,String);
        check(name,String);

        let user = Accounts.findUserByEmail(email);
        let userId;
        let passwd;
        if(!user)
        {
            passwd = Random.hexString(6);
            userId = Accounts.createUser({email:email,password:passwd,profile:{name:name}});
        }else{
            userId = user._id;
        }

        let err = ShareBJ.sendRegisterVerifyCodeEmail(userId);
        if(err){
            throw new Meteor.Error(500,err.message);
        }

        if(passwd){
            Meteor.users.update(userId,{$set:{'services.verification.initial':passwd}});
        }
    },
    'signup/verifyEmail':function(email,code){
        var self = this;

        return Accounts._loginMethod(
            self,
            "signup/verifyEmail",
            arguments,
            "password",
            function () {
                check(code, String);
                check(email, String);

                let user = Accounts.findUserByEmail(email);
                if (!user)
                    throw new Meteor.Error(400, "email is not registered yet");

                let now = new Date();
                if (user.services.verification && user.services.verification.code === code && user.services.verification.when
                    && now.getTime() - user.services.verification.when.getTime() < Accounts._options.verificationValidDuration * 1000) {
                    const initialPassoword = user.services.verification.initial;

                    Meteor.users.update({_id: user._id, 'emails.address': email}, {
                        $unset: {'services.verification': 1},
                        $set: {'emails.$.verified': true}
                    });

                    if (initialPassoword) {
                        Email.send({
                            subject: '初始密码',
                            from: 'Share Baby Journal <sharebj@hy-cloud.info>',
                            to: email,
                            text: `您的ShareBJ初始密码是${initialPassoword}，您可以登录系统设置新的密码。`
                        })
                    }
                    return {userId: user._id}
                } else {
                    throw new Meteor.Error(400, "Verification code expired");
                }
            }
        )
    }
});