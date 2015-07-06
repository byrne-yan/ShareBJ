Journals = new Meteor.Collection('journals');

Journals.allow({
    update: function(userId, post) { return ownsDocument(userId, post); },
    remove: function(userId, post) { return ownsDocument(userId, post); }
});
Journals.deny({
    update: function(userId, jourrnal, fieldNames) {
        // 只能更改如下字段：
        return (_.without(fieldNames, 'title').length > 0);
    }
});
Journals.deny({
    update: function(userId, journal, fieldNames, modifier) {
        var errors = validatePost(modifier.$set);
        return errors.title;
    }
});
Meteor.methods({
    journalInsert: function(journalAttributes) {
        check(Meteor.userId(), String);
        check(journalAttributes, {
            title: String
        });
        //if (Meteor.isServer) {
        //    journalAttributes.title += "(server)";
        //    // wait for 5 seconds
        //    Meteor._sleepForMs(5000);
        //} else {
        //    journalAttributes.title += "(client)";
        //}
        var errors = validatePost(journalAttributes);
        if (errors.title )
            throw new Meteor.Error('invalid-journal;', "你必须为你的日记填写标题");

        var user = Meteor.user();
        var journal = _.extend(journalAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });

        var journalId = Journals.insert(journal);
        return {
            _id: journalId
        };
    }
});

validatePost = function (journal) {
    var errors = {};
    if (!journal.title)
        errors.title = "请填写标题";

    return errors;
}