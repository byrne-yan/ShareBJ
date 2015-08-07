Babies.allow ( {
    insert:function(userId,doc){
        console.log("Babies insert allow:",userId,doc);
        return true;
    },
    update:function(userId,doc,fieldNames,modifier){
        console.log("Babies update allow:",userId,doc,fieldNames,modifier);
        return true;
    }
});