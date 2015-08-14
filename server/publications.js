//Meteor.publish(
//    'journals', function() {
//        return Journals.find();
//    }
//);

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

Meteor.publish('baby_journals',function(babyId){
    return Journals.find({}, {sort: {submitted:-1}});
});

//Meteor.publish("images",function(userId){
//    //check(userId,String);
//    //check(journalId,String);
//    return Images.find();
//});

Meteor.publish("baby_images",function(userId, babyId){
    //check(userId,String);
    //check(babyId,String);
    return Images.find();
});