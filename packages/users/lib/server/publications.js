Meteor.publish("currentUser",function(){
    Meteor.users.findOne({_id:this.userId});
});

