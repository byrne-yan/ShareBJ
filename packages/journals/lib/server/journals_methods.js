Meteor.methods({
    'updateJournalImageURL':function(docId,no,downloadUrl){
        console.log(docId,no,downloadUrl);
        check(docId,String);
        check(no,Number);
        check(downloadUrl,String);

        Journals.update({_id: docId,'images.no':no}, {$set:{'images.$.url':downloadUrl}});
    }
});