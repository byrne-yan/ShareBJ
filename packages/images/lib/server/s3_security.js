AWS = Npm.require('aws-sdk');
var urlapi = Npm.require('url');

AWS.config.update({
    region:Meteor.settings.s3.image.region,
    accessKeyId:Meteor.settings.s3.image.KEY,
    secretAccessKey:Meteor.settings.s3.image.SECRET
});
//console.log(AWS.config.credentials);
//AWS.config.credentials = new AWS.TemporaryCredentials();
AWS.config.credentials = new AWS.TemporaryCredentials({
    DurationSeconds:119600 //36 hours
});

//console.log(AWS.config.credentials);

Images.getPresignedUrl = function(url,ip){
    var getCredentialSync = Meteor.wrapAsync(AWS.config.credentials.get,AWS.config.credentials);
    //console.log("siging url:",url,AWS.config.credentials);

    if(AWS.config.credentials.expired || AWS.config.credentials.expireTime < (new Date())) {
        var refreshCredentialSync = Meteor.wrapAsync(AWS.config.credentials.refresh,AWS.config.credentials);
        refreshCredentialSync();
        console.log("TemporaryCredentials refreshed:",AWS.config.credentials.expireTime);
    }
    var s3 = new AWS.S3({
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken
    });
    var signedUrl =  url?ShareBJ.get_temp_url(Meteor.settings.s3.image.region,
        AWS.config.credentials.accessKeyId,AWS.config.credentials.secretAccessKey,
        AWS.config.credentials.sessionToken,
        Meteor.settings.s3.image.bucket,
        Images.ThumbExpires,
        url,
        ip
    ):null;
    //console.log("signed url:",signedUrl);
    return signedUrl;
};
//replace private url by pre-signed url
Images.getPresignedUrls = function(images,ip){
    return _.map(images,function(image){
        if(image.url || image.thumb)
        {
            var s3 = new AWS.S3({
                accessKeyId: AWS.config.credentials.accessKeyId,
                secretAccessKey: AWS.config.credentials.secretAccessKey,
                sessionToken: AWS.config.credentials.sessionToken
            });

            return _.extend(image,{ thumb: Images.getPresignedUrl(image.thumb,ip),
                url: Images.getPresignedUrl(image.url,ip),
                origin: Images.getPresignedUrl(image.origin,ip)
            })
        }
        return image;
    });
};

Images.getUploadStats = function(userId){
    if(!userId || !Users.findOne({_id:userId}))
        throw  new Meteor(404,"User not found");

    //TODO: no stats yet
    return {counts: 0, size: 0}
}


