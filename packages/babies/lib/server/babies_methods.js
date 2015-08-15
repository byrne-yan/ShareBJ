Meteor.methods({
    CancelGuardian: function(babyId,guardian){ //provided guardian is undefined, current user remove himself from guardians
        check(babyId,String);
        check(guardian,Match.OneOf(String, undefined));

        if(this.userId){
            var  removedGuradian;
            if(guardian){
                removedGuradian = guardian;
                //current user must be the owner
                if(!Babies.findOne({ _id:babyId, 'owners.0':this.userId}))
                {
                    throw new Meteor.Error("Access Denied","First Guardian Required");
                }
            }else{
                removedGuradian = this.userId;
            };

            //First owner can not removed
            if(Babies.findOne({ _id:babyId, 'owners.0':removedGuradian}))
            {
                throw new Meteor.Error("Access Denied","First guardian not allowed to remove");
            }

            if(!Babies.findOne({ _id:babyId, 'owners':removedGuradian}))
            {
                throw new Meteor.Error("Access Denied","Not a guardian");
            }

            Babies.update({_id:babyId},{
                $pullAll: {owners:[removedGuradian]}
            },function(error,updated){
                if(error){
                    throw new Meteor.Error(error);
                }
            });
        }else{
            throw new Meteor.Error("Access Denied","Authorization Required");
        }
    },
    CancelFollowing: function(babyId,follower){
        check(babyId,String);
        check(follower,Match.OneOf(String, undefined));

        if(this.userId){
            var  removedFollower;
            if(follower){
                removedFollower = follower;
            }else{
                removedFollower = this.userId;
            };

            if(!Babies.findOne({ _id:babyId, 'followers':removedFollower}))
            {
                throw new Meteor.Error("Access Denied","Not A Follower");
            }

            Babies.update({_id:babyId},{
                $pullAll: {followers:[removedFollower]}
            },function(error,updated){
                if(error){
                    throw new Meteor.Error(error);
                }
            });
        }else{
            throw new Meteor.Error("Access Denied","Authorization Required");
        }
    },
    ApproveRequest: function(requestId){
        check(requestId,String);
        var request = Requests.findOne({_id:requestId});
        if(!request || (request.type!='guard' && request.type!='follow') )
        {
            throw  Meteor.Error("Approval Failure","Invalid Request");
        }
        if(request.type==='guard'){
            Babies.update({_id: request.baby},{
                $push: {owners:request.requester},
                $pull: {followers: request.requester}
            });
        }else {
            Babies.update({_id: request.baby},{
                $push: {followers:request.requester}
            });
        }
        Requests.remove({_id:requestId});
    },
    RejectRequest: function(requestId){
        check(requestId,String);
        Requests.remove({_id:requestId});
    }
});