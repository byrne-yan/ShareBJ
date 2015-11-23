Meteor.methods({
    RequestFollowing: function(babyId){
        check(babyId,String);

        if(this.userId){
            //not follower or guardian
            if(Babies.findOne({ $and: [
                    {_id:babyId},
                    {$or:
                        [
                            {gurdians:this.userId},
                            {followers:this.userId},
                        ]
                    }]
                }) ||
                Requests.findOne({baby:babyId,requester:this.userId})
            )
                throw new Meteor.Error("Access Denied","Already be baby's guardian, follower or request submitted");

            var user = Meteor.users.findOne({_id:this.userId});
            Requests.insert({
                    baby:babyId,
                    requester: this.userId,
                    type:"follow",
                    requestAt: new Date()
                }
                ,function(error){
                    if(error){
                        throw new Meteor.Error(error);
                    }
                });
        }else{
            throw new Meteor.Error("Access Denied","Authorization Required");
        }
    },
    RequestGuardian: function(babyId){
        check(babyId,String);

        if(this.userId){
            //not guardian
            if(Babies.findOne({
                        _id:babyId,
                        gurdians:this.userId
                }) ||
                Requests.findOne({baby:babyId,requester:this.userId,type:'guard'})
            )
            {
                throw new Meteor.Error("Access Denied","Already be baby's guardian, or guardian request submitted");
            }

            Requests.insert({
                baby:babyId,
                requester: this.userId,
                type:"guard",
                requestAt: new Date()
            },function(error){
                if(error){
                    throw new Meteor.Error(error);
                }
            });
        }else{
            throw new Meteor.Error("Access Denied","Authorization Required");
        }
    },
    CancelRequestGuardian: function(babyId){
        check(babyId,String);

        if(this.userId){

            if(!Requests.findOne({
                    baby:babyId,
                    requester:this.userId,
                    type:'guard'
                }))
            {
                throw new Meteor.Error("Access Denied","No guardian request found");
            }

            Requests.remove({
                baby:babyId,
                requester:this.userId,
                type:"guard"
            },function(error){
                if(error){
                    throw new Meteor.Error(error);
                }
            });
        }else{
            throw new Meteor.Error("Access Denied","Authorization Required");
        }
    },
    CancelRequestFollowing: function(babyId){
        check(babyId,String);

        if(this.userId){

            if(!Requests.findOne({
                    baby:babyId,
                    requester:this.userId,
                    type:'follow'
                }))
            {
                throw new Meteor.Error("Access Denied","No following request found");
            }


            Requests.remove({
                baby:babyId,
                requester: this.userId,
                type:"follow"
            },function(error){
                if(error){
                    throw new Meteor.Error(error);
                }
            });
        }else{
            throw new Meteor.Error("Access Denied","Authorization Required");
        }
    }
});