var authorizeFn = function(file, meta) {
    if (!this.userId) {
        throw new Meteor.Error(401,"Please Login before uploading images");
    }
    console.log("authorize:",file,meta);

    var limits = Users.getUploadLimits(this.userId) || {counts: 0, size: 0, quality:"high"};
    var stats = Images.getUploadStats(this.userId);
    if (limits.counts > 0 && stats.counts >= limits.counts) {
        throw new Meteor.Error(403,"Hit upload times limit, please upgrade your account!");
    }
    if (limits.size > 0 && stats.size + file.size > limits.size) {
        throw new Meteor.Error(403,"Hit upload size limit, please upgrade your account!");
    }
    if(limits.quality!=="high" && file.size>Images.NormalQualityMaxSize){
        throw new Meteor.Error(403,"Hit upload quality limit, please upgrade your account!");
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
        const s3key = Meteor.settings.s3.image.prefix + metaContext.journalId + '/'+ metaContext.imageId + '.' + file.type.split("/")[1];
        console.log(s3key);
        return s3key;
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
        const s3key = Meteor.settings.s3.image.prefix + metaContext.journalId + '/'+ metaContext.imageId + '_thumbnail' + '.' + file.type.split("/")[1];
        console.log(s3key);
        return s3key;
    }
});

Slingshot.createDirective("originUploads",Slingshot.S3Storage,{
    region:Meteor.settings.s3.image.region,
    bucket: Meteor.settings.s3.image.bucket,
    acl:Meteor.settings.s3.image.acl,
    AWSAccessKeyId: Meteor.settings.s3.image.KEY,
    AWSSecretAccessKey:Meteor.settings.s3.image.SECRET,
    authorize: authorizeFn,
    key: function(file, metaContext){
        const s3key = Meteor.settings.s3.image.prefix + metaContext.journalId + '/'+ metaContext.imageId + '_origin' + '.' + file.type.split("/")[1];
        console.log(s3key);
        return s3key;
    }
})