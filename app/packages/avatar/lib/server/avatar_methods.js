Meteor.methods({
     'avatar/upload': function (avatarId,avatarUrl) {
          if(this.userId){
               const id = Avatars.insert({_id:avatarId,owner:this.userId,url:avatarUrl});

               if(id!=avatarId)
                    throw new Meteor.Error(500,'Fail to create avatar');
               return id;
          }else{
               throw new Meteor.Error(400,'Login required');
          }
     }
});