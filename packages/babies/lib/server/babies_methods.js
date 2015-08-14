Meteor.methods({
    CancelGuardian: function(babyId){
        check(babyId,String);

        if(this.userId){
            //First owner can not removed
            if(Babies.findOne({ _id:babyId, 'owners.0':this.userId}))
            {
                throw new Meteor.Error("Access Denied","First guardian not allowed to remove");
            }

            if(!Babies.findOne({ _id:babyId, 'owners':this.userId}))
            {
                throw new Meteor.Error("Access Denied","Not a guardian");
            }

            Babies.update({_id:babyId},{
                $pullAll: {owners:[this.userId]}
            },function(error,updated){
                if(error){
                    throw new Meteor.Error(error);
                }
            });
        }else{
            throw new Meteor.Error("Access Denied","Authorization Required");
        }
    },
    CancelFollowing: function(babyId){
        check(babyId,String);

        if(this.userId){

            if(!Babies.findOne({ _id:babyId, 'followers':this.userId}))
            {
                throw new Meteor.Error("Access Denied","Not a follower");
            }

            Babies.update({_id:babyId},{
                $pullAll: {followers:[this.userId]}
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