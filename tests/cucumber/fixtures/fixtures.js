Meteor.methods({
    'reset':function(){
      Meteor.users.remove({});
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
    }
});