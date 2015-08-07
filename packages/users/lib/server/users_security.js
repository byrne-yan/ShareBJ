Meteor.users.deny({
    update:function(){
        return true;
    }
});

Accounts.config({
    sendVerificationEmail:true
});

Accounts.onCreateUser(function(options, user){
   //for first account, tag it as a admin
    if(Meteor.users.find({}).count()===0)
    {
        user.isAdmin = true;
    }

    if(options.profile)
        user.profile = options.profile;
    return user;
});
