Meteor.publish('myBabies',function(){
    return Babies.find({owners:this.userId},{sort:[["conceptionDate","desc"],["birth.birthTime","desc"]]});
});