Images.uploadThumbs = function(images,journalId,callback){
    return Promise.all(_.map(images,function(image,idx) {
        var uploaderThumb = new Slingshot.Upload("thumbUploads", {journalId:journalId});
        console.log("Thumb uploading #" + idx, image.filename, image.dataAsUrl);

        return new Promise(function (resolve, reject) {
            uploaderThumb.send(ShareBJ.dataURL2Blob(image.dataAsUrl), function (error, downloadUrl) {
                if (error) {
                    return reject(error);
                } else {
                    return callback(resolve,reject,journalId,idx,downloadUrl);
                }
            });
        });
    }));
};

Images.uploadImages = function(images,journalId,callback){
  return Promise.all(_.map(images,function(image,idx){
      var uploaderImage = new Slingshot.Upload("imageUploads", {journalId: journalId});
      console.log("image uploading :", image.filename, image.file);

      var limits = Users.getUploadLimits() || {counts: 0, size: 0, quality:"high"};

      var width = limits.quality==='high'?Images.HighQualityWidth:Images.NormalQualityWidth;
      var height = limits.quality==='high'?Images.HighQualityHeight:Images.NormalQualityHeight;
      processImage(image.file, width,height,1,function(dataURL){
          return new Promise(function (resolve, reject) {
              uploaderImage.send(ShareBJ.dataURL2Blob(dataURL), function (error, downloadUrl) {
                  if (error) {
                      return reject(error);
                  } else {
                      return callback(resolve,reject,journalId,idx,downloadUrl);
                  }
              });
          });
      });
  }));

};

