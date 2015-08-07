Slingshot.createDirective("avatarUploads",Slingshot.S3Storage,{
    region:Meteor.settings.s3.avatar.region,
    bucket: Meteor.settings.s3.avatar.bucket,
    acl:Meteor.settings.s3.avatar.acl,
    AWSAccessKeyId: Meteor.settings.s3.avatar.KEY,
    AWSSecretAccessKey:Meteor.settings.s3.avatar.SECRET,
    authorize: function(){
        if(!this.userId){
            throw new Meteor.err("Login Required");
        }
        //TODO: limit upload frequency
        return true;
    },
    key: function(file){
        var t = new Date().toISOString().replace(/[-,:]/g,'_');
        return Meteor.settings.s3.avatar.prefix + this.userId + "_avatar_" + t + '.' + file.type.split("/")[1];
    }
})