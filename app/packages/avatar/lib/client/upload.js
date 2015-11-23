Avatars.upload = function(imageDataUrl,principalId){
    return new Promise(function(resolve,reject){
        //if(typeof imageDataUrl != 'string' || !/^data:/.test(imageDataUrl))
        //{
        //    reject(new Error('Only data url accepted!') );
        //    return;
        //};
        const meta = {avatarId:Random.id(),
            principalId:principalId
        };
            console.log("meta:",meta);
        var uploader = new Slingshot.Upload("avatarUploads",meta);
        processImage(imageDataUrl,{ maxWidth:40, maxHeight:40, quality:1 } ,
            function(dataURL){
                uploader.send(ShareBJ.dataURL2Blob(dataURL),
                    function (error, downloadUrl) {
                        if (error) {
                            return reject(error);
                        } else {
                            Meteor.call('avatar/upload',meta.avatarId, downloadUrl,function(err,avatarId){
                                if(err){
                                    reject(err);
                                }else{
                                    resolve(avatarId);
                                }
                            })
                        }
                    }
                );
            });
        }
    );
};