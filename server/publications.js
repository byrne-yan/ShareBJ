//Meteor.publish(
//    'journals', function() {
//        return Journals.find();
//    }
//);
Meteor.publish(
    'allBabies', function() {
        return Babies.find();
    }
);
Meteor.publish(
    'ownBabies', function(ownerID) {
        return ownBabies(ownerID);
    }
);
Meteor.publish(
    'followingBabies', function(followerID) {
        return followingBabies(followerID);
    }
);
Meteor.publish(
    'journalists', function(babyID) {
        return Meteor.users.find({baby:babyID});
    }
);

Meteor.publish(
    'journalists_all', function() {
        return Meteor.users.find();
    }
);

Meteor.publish('journals',function(babyId){
    return Journals.find();
});

Meteor.publish("images",function(babyId){
    //check(userId,String);
    //check(journalId,String);
    return Images.find();
});