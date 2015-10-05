
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
    }
});