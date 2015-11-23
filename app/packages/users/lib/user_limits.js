Users.getUploadLimits = function(userId,callback){
    if(Meteor.isServer){
        if(!userId)
            throw Meteor.Error(400,'User required');

        return getUploadLimits(userId);
    };

    if(Meteor.isClient){
        Meteor.call('limits/uploadImages',Meteor.userId(),callback);
    }
};

