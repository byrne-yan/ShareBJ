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
    AcceptInvitation: function(token,invitor){
        check(invitor,String);
        check(token,String);

        var user = Meteor.users.findOne({_id:invitor,'services.invitation.verificationTokens.token':token},{
            fields:{'services.invitation.verificationTokens.$': 1}
        });
        if(!user){
            throw  Meteor.Error(404, "Invalid Invitation Token");
        }
        console.log(user);
        //check if token expired
        var token = user.services.invitation.verification[0];
        console.log(token);
        var now = new Date();

        if( now.getTime() - token.when.getTime() >= 3*24*60*60*1000)
            throw new Meteor.Error(403, "Invitation Token Expired");

        if(token.invitee !== this.userId)
        {
            console.log('token.invitee',token.invitee);
            throw new Meteor.Error(403, "Not Invitee");
        }

        guardianOrFollower = this.userId;
        var type = token.type;
        var babyId = token.baby;
        if(type==='guard'){
            Babies.update({_id: babyId},{
                $push: {owners:guardianOrFollower},
                $pull: {followers: guardianOrFollower}
            });
        }else {
            Babies.update({_id: babyId},{
                $push: {followers:guardianOrFollower}
            });
        }
        if(user)
        {
            var nUpdated = Meteor.users.update(user,{
                $pull :{ 'services.invitation.verificationTokens': {token:token}}
            });
            if(nUpdated===0){
                throw new Meteor.Error(500,'Can not remove invitation token');
            }
        }
    }
    ,ApproveRequest: function(requestId){
        check(requestId,String);
        var request = Requests.findOne({_id:requestId});
        if(!request || (request.type!='guard' && request.type!='follow') )
        {
            throw new Meteor.Error(404,"Invalid Request");
        }
        guardianOrFollower =request.requester;
        var babyId = request.baby;
        var type =request.type;

        if(type==='guard'){
            if(Babies.findOne({owners:request.requester}))
            {
                throw new Meteor.Error(400,"Requester is already a guardian ")
            }
            Babies.update({_id: babyId},{
                $push: {owners:guardianOrFollower},
                $pull: {followers: guardianOrFollower}
            });
        }else {
            if(Babies.findOne({followers:request.requester}))
            {
                throw new Meteor.Error(400,"Requester is already a follower ")
            }
            Babies.update({_id: babyId},{
                $addToSet: {followers:guardianOrFollower}
            });
        }

        Requests.remove({_id:requestId});
    },
    RejectRequest: function(requestId){
        check(requestId,String);
        Requests.remove({_id:requestId});
    }
    ,InviteFor: function(target,babyId){
        check(target,String);
        mobileReg = new RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/);
        emailReg = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

        target = target.trim();
            //try to treat target as a username
        var targetUser = Meteor.users.findOne({username:target});
        if(targetUser){
            return [targetUser,'username',false];
        }

        //var targetUser = Meteor.users.findOne({'profile.name':target});
        //if(targetUser){
        //    return [targetUser,'username',true];
        //}


        var type='unregistered';
        var subtype = 'unknown';

        //try to treat target as a mobile phone
        if(target.match(mobileReg))
        {
            //check if the mobile is claimed by existing user
            var m = Meteor.users.findOne({'profile.mobiles.number':target},
                {'profile.mobiles': {$elemMatch:{number:target}}}
            );
            if(m)
            {
                return [m,'mobile', m.profile.mobiles[0].verified];
            }
            subtype = 'mobile';
        }

        if(target.match(emailReg)){
            subtype = 'email';

            var email =  Meteor.users.findOne({'emails.address':target},
                {'emails': {$elemMatch:{address:target}}}
            );
            if(email){
                return [email,'email',email.emails[0].verified]
            }
        }

        return [target,type,subtype];
    }
    ,Invite: function(invitee, babyId, type, action){
        console.log('invitee',invitee);

        if(type==='user' && !invitee)
            throw  Meteor.Error(400,'Invitee needed');

        if(action !== 'guard' && action !== 'follow' )
            throw  Meteor.Error(400,'Only guard and follow allowed');

        var baby = Babies.findOne({_id:babyId, owners: this.userId});
        if(!baby)
            throw Meteor.Error(404,'Invalid Baby ID');


        switch(type){
            case 'user':
                var stampedToken = Accounts._generateStampedLoginToken();
                Meteor.users.update({_id:this.userId},{$push:{'services.invitation.verificationTokens':{
                    token: stampedToken.token,
                    when:stampedToken.when,
                    baby: babyId,
                    type:action,
                    invitee: invitee
                }}});
                var invitationData = {
                    invitor:{
                        userId: this.userId,
                        name: Meteor.user().username,
                        nickname: Meteor.user().profile.name
                    },
                    baby:{
                        babyId: baby._id,
                        name:baby.name,
                        nickname:baby.nickname,
                        born: !!baby.birth,
                        date: baby.birth?baby.birth.birthTime:baby.conceptionDate
                    },
                    type:action,
                    token: stampedToken.token,
                    when: stampedToken.when
                };
                Herald.createNotification( invitee ,{
                    courier: 'UserInvitation',
                    data: invitationData,
                    url:process.env.ROOT_URL+'babies/invitations?token='+stampedToken.token
                                            + '&invitor=' + this.userId
                                            + '&baby=' + baby._id
                });
                break;
            case 'email':
                var stampedToken = Accounts._generateStampedLoginToken();
                var invitationData = {
                    token: stampedToken.token,
                    when: stampedToken.when,
                    invitor:{
                        userId: this.userId,
                        name: Meteor.user().username,
                        nickname: Meteor.user().profile.name
                    },
                    baby:{
                        babyId: baby._id,
                        name:baby.name,
                        nickname:baby.nickname,
                        born: !!baby.birth,
                        date: baby.birth?baby.birth.birthTime:baby.conceptionDate
                    },
                    type:action, //guard or follow
                    invitee:invitee
                };

                UserInvitations.insert(invitationData);

                ShareBJ.emailer.sendUserInvitation(
                    invitee,
                    invitationData,
                    process.env.ROOT_URL+'users/signup?token='+stampedToken.token + '&email=' + invitee
                );

                break;
            case 'mobile':
                throw new Meteor.Error(500,"Not implemented yet");

                //var stampedToken = Accounts._generateStampedLoginToken();
                //var invitationData = {
                //    token: stampedToken.token,
                //    when: stampedToken.when,
                //    invitor:{
                //        userId: this.userId,
                //        name: Meteor.user().username,
                //        nickname: Meteor.user().profile.name
                //    },
                //    baby:{
                //        babyId: baby._id,
                //        name:baby.name,
                //        nickname:baby.nickname,
                //        born: !!baby.birth,
                //        date: baby.birth?baby.birth.birthTime:baby.conceptionDate
                //    },
                //    type:action, //guard or follow
                //    invitee:invitee
                //};
                //
                //UserInvitations.insert(invitationData);
                //
                //const sendSMSSync = Meteor.wrapAsync(SMSDeliver.sendMessage,SMSDeliver);
                //let invitorName =  Meteor.user().profile.name || Meteor.user().username;
                //if(Meteor.user().phone)
                //    invitorName += '/' + Meteor.user().phone.number;
                //
                //try{
                //    sendSMSSync('template:invite_user',invitee,{
                //        invitor: invitorName,
                //        baby:baby.name,
                //        url:process.env.ROOT_URL+'users/invitation?token='+stampedToken.token + '&mobile=' + invitee
                //    })
                //}catch(e)
                //{
                //    throw new Meteor.Error(500,e.message);
                //}

                break;
        }
    }
});