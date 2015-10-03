Meteor.methods({
    'fixtures/users/reset':function(){
        Meteor.users.remove({});
    },
    'fixtures/users/makeupTest1':function(){
        Accounts.createUser({username:'test1',password:'test1'});
    },
    'signUp':function(user){
        Accounts.createUser(user);
    },
    'registerBaby':function(userId, baby){

        Babies.insert( baby, function(err,babyId){
            if(!err){
                owner = Meteor.users.findOne({_id:userId});
                if(owner){
                    if(owner.babies)
                    {
                        owner.babies = [babyId];
                    }else{
                        owner.babies.push(babyId);
                    }
                }
            }
        } );
    },

    'fixtures/registerUserWithPhone': function(phone,password){
        //console.log('Accounts',Accounts)
        Accounts.createUser({
            username:'phone'+phone,
            phone:phone,
            password: password
        });
        Meteor.users.update({'phone.number':phone},{$set:{'phone.verified':true}});
    },
    'fixtures/getUserWithPhone': function(phone){
        console.log('fixtures/getUserWithPhone called');
        return Meteor.users.findOne({'phone.number':phone});
    },
    'fixtures/getSMSCode': function(phone){
        //console.log('fixtures/getSMSCode called');
        var user = Meteor.users.findOne({'services.phone.verification.phone': phone});
        if(!user)
            throw new Meteor.Error(404,"No sms code for the phone:"+phone);
        return user.services.phone.verification.code;
    },
    'fixtures/avatar/get': function(avatarId){
        return Avatars.findOne({_id:avatarId});
    }
});
