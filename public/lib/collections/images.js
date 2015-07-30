if(Meteor.isServer)
{
    var createThumb =function(fileObj, readStream, writeStream){
        gm(readStream).resize('32','32').stream().pipe(writeStream);
    };

    imageStoreS3Large = new FS.Store.S3("originals",{
        //region: "ap-southeast-1",
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:"sharebj",
        //ACL:"private",
        folder:"dev/originals"
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
        folder:"dev/thumbs",
        transformWrite:createThumb,
        //transformRead:myTransformReadFunction,
        //maxTries:3
        //fileKeyMaker: function(fileObj){
        //    var store = fileObj && fileObj._getInfo("thumbs");
        //
        //    if(store && store.key) return store.key;
        //
        //    var filename = fileObj.name();
        //    var filenameInStore = fileObj.name({store:"thumbs"});
        //    return fileObj.collectionName + '/thumbs/' + fileObj._id + '-' + (filenameInStore || filename);
        //}
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

Images.on('stored', function(fileObj, storeName) {
    Log.info("File stored on " + storeName + " for" + fileObj._id + ',createdByTransformed:'+fileObj.createdByTransform);
});
Images.on('uploaded', function(fileObj) {
    Log.info("File uploaded for " + fileObj._id + ',createdByTransformed:'+fileObj.createdByTransform);
});

if(Meteor.isServer){
    Images.allow({
        insert: function () {return true; },
        update: function () {return true; }

    });


}

Images.allow({
    download: function() {return true;}
});

Meteor.methods({
    insertImage: function(journal, callback){
        return Images.insert(journal,callback);
    }
});

