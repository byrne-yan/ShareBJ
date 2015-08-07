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
            Meteor.setTimeout(function(){
                Accounts.sendVerificationEmail(userId,email);
            },2*1000);
        }else{
            throw new Meteor.Error("Access Denied");
        }
    },

    updateCurrentUserMobile: function(userId, mobile){
        check(userId,String);
        check(mobile,String);
        if(this.userId && userId === this.userId)
        {
            n = Meteor.users.update({_id:userId},
                {$set:{'profile.mobiles':[{number:mobile,verified:false}]}});
            if ( n !== 1){
                throw new Meteor.Error("Updating mobile fails");
            }
            //TODO: sendVerificationSMS
            //Meteor.setTimeout(function(){
            //    sendVerificationSMS(userId,mobile);
            //},2*1000);
        }else{
            throw new Meteor.Error("Access Denied");
        }
    },
    updateCurrentUserAvatar: function(userId,url){
        check(userId,String);
        check(url,String);
        if(this.userId && userId === this.userId)
        {
            n = Meteor.users.update({_id:userId},
                {$set:{'profile.avatar':url}}
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
    updateCurrentUserMemo: function(userId, memo){
        check(userId,String);
        check(memo,String);
        if(this.userId && userId === this.userId)
        {
            n = Meteor.users.update({_id:userId},
                {$set:{'profile.memo':memo}});
            if ( n !== 1){
                throw new Meteor.Error("Updating memo fails");
            }
        }else{
            throw new Meteor.Error("Access Denied");
        }
    }
});