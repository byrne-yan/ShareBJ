Babies.allow ( {
    insert:function(userId,doc){
        if(Babies.find({owners:userId}).count()>5) {
            throw new Meteor.Error("Access Denied", "Too many babies", "Only five babies allowed for one user");
            return false;
        }
        console.log("Babies insert allow:",userId,doc);
        return true;
    },
    update:function(userId,doc,fieldNames,modifier){
        //only owners can update baby's info
        if(!_.contians(doc.owners,userId))
            return false;

        console.log("Babies update allow:",userId,doc,fieldNames,modifier);
        return true;
    }
});