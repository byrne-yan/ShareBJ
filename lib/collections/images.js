if(Meteor.isServer)
{
    var createThumb =function(fileObj, readStream, writeStream){
        gm(readStream).resize('10','10').stream().pipe(writeStream);
    }

    imageStoreS3Large = new FS.Store.S3("images",{
        //region: "ap-southeast-1",
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:"sharebj",
        //ACL:"private",
        folder:"dev"
        //transformWrite:myTransformWriteFunction,
        //transformRead:myTransformReadFunction,
        //maxTries:3
    });

    imageStoreS3Thumbnail = new FS.Store.S3("thumbs",{
        //region: "ap-southeast-1",
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:"sharebj",
        //ACL:"private",
        folder:"dev",
        transformWrite:createThumb,
        //transformRead:myTransformReadFunction,
        //maxTries:3
        fileKeyMaker: function(fileObj){
            var store = fileObj && fileObj._getInfo("thumbs");

            if(store && store.key) return store.key;

            var filename = fileObj.name();
            var filenameInStore = fileObj.name({store:"thumbs"});
            return fileObj.collectionName + '/thumbs/' + fileObj._id + '-' + (filenameInStore || filename);
        }
    });

}else if(Meteor.isClient){
    imageStoreS3Large = new FS.Store.S3("images");
    imageStoreS3Thumbnail = new FS.Store.S3("thumbs");
}
Images = new FS.Collection("images",{
    stores: [imageStoreS3Thumbnail, imageStoreS3Large]/*,
    filter: {
        allow: {
            contentType: ['image/*']
        }
    }
*/
});

Images.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    }

});