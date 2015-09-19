var authorizeFn = function(file, meta) {
    if (!this.userId) {
        throw new Meteor.err(401,"Please Login before uploading images");
    }
    console.log("authorize:",file,meta);

    var limits = Users.getUploadLimits(this.userId) || {counts: 0, size: 0, quality:"high"};
    var stats = Images.getUploadStats(this.userId);
    if (limits.counts > 0 && stats.counts >= limits.counts) {
        throw new Meteor.Error(403,"Upload times limit reached, please upgrade your account!");
    }
    if (limits.size > 0 && stats.size + file.size > limits.size) {
        throw new Meteor.Error(403,"Upload size limit reached, please upgrade your account!");
    }
    if(limits.quality!=="high" && file.size>Images.NormalQualityMaxSize){
        throw new Meteor.Error(403,"Upload quality limit reached, please upgrade your account!");
    }

    return true;
};

Slingshot.createDirective("imageUploads",Slingshot.S3Storage,{
    region:Meteor.settings.s3.image.region,
    bucket: Meteor.settings.s3.image.bucket,
    acl:Meteor.settings.s3.image.acl,
    AWSAccessKeyId: Meteor.settings.s3.image.KEY,
    AWSSecretAccessKey:Meteor.settings.s3.image.SECRET,
    authorize: authorizeFn,
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
    authorize: authorizeFn,
    key: function(file, metaContext){
        var t = new Date().toISOString().replace(/[-,:]/g,'_');
        return Meteor.settings.s3.image.prefix + "thumbs/" + + metaContext.journalId + "_image_" + t + '.' + file.type.split("/")[1];
    }
})