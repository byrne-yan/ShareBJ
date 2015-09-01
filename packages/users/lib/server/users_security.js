Meteor.users.deny({
    update:function(){
        return true;
    }
});

Accounts.config({
    sendVerificationEmail:true
});

Accounts.onCreateUserEx(function(options, user){
    if(originalOnCreateUser)
    {
        try{
            user = originalOnCreateUser(options,user)
        }catch(e){
            throw e;
        }
    }

    console.log('onCreateUser');
   //for first account, tag it as a admin
    if(Meteor.users.find({}).count()===0)
    {
        user.isAdmin = true;
    }

    if(options.profile)
        user.profile = options.profile;

    if(user.profile && user.profile.token){
        //console.log(user.profile.token)
        var invitation = UserInvitations.findOne({token:user.profile.token});
        if(invitation && (invitation.invitee===user.emails[0].address
                            || invitation.invitee===user.profile.mobiles[0].number) )
        {
            var baby = Babies.findOne(invitation.baby.babyId);
            if(baby )
            {
                //console.log(baby);
                if(invitation.type==='guard'){
                    var n = Babies.update(baby._id,{
                        $addToSet: {owners:user._id},
                        $pull:{followers: user._id}
                    });
                    //console.log('attach to owners',n);
                    user.profile.invitedBy ={
                        token:user.profile.token,
                        subject: invitation.invitee
                    };
                    delete user.profile.token;
                }else if(invitation.type=='follow'){
                    Babies.update(baby._id,{
                        $addToSet: {followers:user._id}
                    });
                    //console.log('attach to followers',n);
                    user.profile.invitedBy ={
                        token:user.profile.token,
                        subject: invitation.invitee
                    };
                    delete user.profile.token;
                }
            }
        }
    };

    return user;
});

Accounts.validateNewUser(function(user){
    console.log('validateNewUser');

    if(user.profile && user.profile.token){
        return false;
    };

    return true;
});