
Slingshot.fileRestrictions("imageUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: 4 * 1024 * 1024 //4M
});

Slingshot.fileRestrictions("thumbUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: 128 * 1024 //128K
});


Journals = new Mongo.Collection('journals',{
    transform: function(doc){
        doc.authorDetail = Meteor.users.findOne({_id:doc.author});
        doc.babyDetail = Babies.findOne({_id:doc.baby});

        return doc;
    }
});

