Journals = new Mongo.Collection('journals');

Journals.before.insert(function(userId, doc){
    doc.createdAt = new Date();
});

