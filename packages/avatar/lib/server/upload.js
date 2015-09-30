Slingshot.createDirective("avatarUploads",Slingshot.S3Storage,{
    region:Meteor.settings.s3.avatar.region,
    bucket: Meteor.settings.s3.avatar.bucket,
    acl:Meteor.settings.s3.avatar.acl,
    AWSAccessKeyId: Meteor.settings.s3.avatar.KEY,
    AWSSecretAccessKey:Meteor.settings.s3.avatar.SECRET,
    authorize: (file,metaContext) => {
        console.log("upload authorized for:",metaContext);
        //if(!this.userId){
        //    throw new Meteor.Error(400,"Login Required for uploading avatar");
        //}
        //TODO: limit upload frequency
        return true;
    },
    key: function(file,metaContext){
        var t = new Date().toISOString().replace(/[-,:]/g,'_');
        return Meteor.settings.s3.avatar.prefix + metaContext.principalId + '/'+ metaContext.avatarId + '.' + file.type.split("/")[1];
    }
})