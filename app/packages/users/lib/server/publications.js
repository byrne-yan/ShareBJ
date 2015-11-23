Meteor.publish("currentUser",function(){
    Meteor.users.findOne({_id:this.userId});
});


Meteor.publish("getUser",function(userIds){
    check(userIds,Array);

    //console.log(userIds);
    return Meteor.users.find({_id:{$in: userIds}},{
        fields:{username:1, 'profile.name':1}
    });
});

