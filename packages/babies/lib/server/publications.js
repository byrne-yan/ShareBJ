Meteor.publish('myBabies',function(){
    return Babies.find({owners:this.userId});
});