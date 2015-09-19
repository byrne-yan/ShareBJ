Meteor.methods({
    'updateJournalImageURL':function(docId,no,downloadUrl){
        console.log(docId,no,downloadUrl);
        check(docId,String);
        check(no,Number);
        check(downloadUrl,String);

        Journals.update({_id: docId,'images.no':no}, {$set:{'images.$.url':downloadUrl}});
    },
    'upvote':function(journalId,voterId){
        check(journalId,String);
        check(voterId,String);
        if(this.userId === voterId){
            var affected = Journals.update({_id:journalId},{$addToSet: {upvoters:voterId}});
            if(affected!==1){
                throw new Meteor.Error(400,"No journal found");
            }
            return affected;
        }else{
            throw new Meteor.Error(401,"Voter not login");
        }
    },
    'commentOnJournal':function(journalId,commenterId,comment){
        console.log(journalId,commenterId,comment);
        check(journalId,String);
        check(commenterId,String);
        check(comment,String);

        if(this.userId === commenterId){
            var affected = Journals.update({_id:journalId},{$push: {comments:{commenter:commenterId,comment:comment}}});
            if(affected!==1){
                throw new Meteor.Error(400,"No journal found");
            }
            return affected;
        }else{
            throw new Meteor.Error(401,"Commenter not login");
        }
    }
});