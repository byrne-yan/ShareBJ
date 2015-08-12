Slingshot.createDirective("imageUploads",Slingshot.S3Storage,{
    region:Meteor.settings.s3.image.region,
    bucket: Meteor.settings.s3.image.bucket,
    acl:Meteor.settings.s3.image.acl,
    AWSAccessKeyId: Meteor.settings.s3.image.KEY,
    AWSSecretAccessKey:Meteor.settings.s3.image.SECRET,
    authorize: function(){
        if(!this.userId){
            throw new Meteor.err("Login Required");
        }
        //TODO: limit upload frequency
        return true;
    },
    key: function(file, metaContext){
        var t = new Date().toISOString().replace(/[-,:]/g,'_');
        return Meteor.settings.s3.image.prefix + metaContext.journalId + "_image_" + t + '.' + file.type.split("/")[1];
    }
});

Slingshot.createDirective("thumbUploads",Slingshot.S3Storage,{
    region:Meteor.settings.s3.image.region,
    bucket: Meteor.settings.s3.image.bucket,
    acl:Meteor.settings.s3.image.acl,
    AWSAccessKeyId: Meteor.settings.s3.image.KEY,
    AWSSecretAccessKey:Meteor.settings.s3.image.SECRET,
    authorize: function(){
        if(!this.userId){
            throw new Meteor.err("Login Required");
        }
        //TODO: limit upload frequency
        return true;
    },
    key: function(file, metaContext){
        var t = new Date().toISOString().replace(/[-,:]/g,'_');
        return Meteor.settings.s3.image.prefix + "thumbs/" + + metaContext.journalId + "_image_" + t + '.' + file.type.split("/")[1];
    }
})