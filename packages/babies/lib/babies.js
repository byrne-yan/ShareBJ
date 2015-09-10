Babies = new Mongo.Collection('babies');

Baby = function () {};

Baby.prototype = {
    isFollower: function(userId){
        return _.contains(this.followers,userId);
    },
    isGuardian: function(userId){
        return _.contains(this.owners,userId);
    },

    isOwner: function(userId){
        return this.owners[0] === userId;
    },

    isGuardianOrFollower: function(userId){
        return _.contains(this.owners,userId) || _.contains(this.followers,userId);
    }

};

Slingshot.fileRestrictions("avatarBabyUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: 4 * 1024 //4K
});