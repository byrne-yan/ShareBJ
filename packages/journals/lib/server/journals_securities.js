Journals.allow ( {
    insert:function(userId,doc){
        console.log("Journals insert allow:",userId,doc);
        return true;
    },
    update:function(userId,doc,fieldNames,modifier){
        //console.log("Journals update allow:",userId,doc,fieldNames,modifier);
        return true;
    }
});


