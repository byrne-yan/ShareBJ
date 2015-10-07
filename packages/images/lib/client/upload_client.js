class MyUploader{
    constructor(category,journalId,imageId,resolution){
        console.log(category,journalId,imageId,resolution);
        check(category,Match.OneOf('imageUploads','originUploads'));
        check(resolution,{width:Number,height:Number});
        check(journalId,String);
        check(imageId,String);

        this._resolution = resolution;
        this._journalId = journalId;
        this._id = Random.id();
        if(category==="imageUploads")
            this._category = "scaled";
        else if(category==="originUploads")
            this._category = "origin";
        this._uploader = new Slingshot.Upload(category,{journalId:journalId,imageId:imageId,resolution});
    }
    send(blob,callback){
        console.log(blob);
        //check(blob,Match.ObjectIncluding({name:String,size:Number,'type':Match.Where((x)=>{return /^image\/.*/g.test(x)})}));

        var self = this;
        Uploads.insert({uploader:this._id,filename:blob.name,size:blob.size,category:this._category,
                    resolution:{
                        width:this._resolution.width,
                        height:this._resolution.height
                    },
                    start:new Date(),
                    journal:this._journalId,progress:0}
                ,function(err,res){
            if(err) return callback(err);

            Tracker.autorun(function(c){
                self._computation = c;
                var status = self._uploader.status();
                var percent = self._uploader.progress();
                //console.log("atuorun progress",percent);
                //if(_.isFinite(percent))
                //{
                Uploads.update({uploader:self._id},{$set:{progress:Math.ceil(percent*100),status:status}},null);
                //}
            });

            var ret= self._uploader.send(blob,function(err,downlaodUrl){
                self._computation.stop();
                Uploads.removeUploader(self._uploader);
                if(err)
                {
                    Uploads.update({uploader:self._id},{$set:{
                        progress:Math.ceil(100*self._uploader.progress()),
                        status:self._uploader.status(),
                        end: new Date()}
                    });
                }else{
                    Uploads.update({uploader:self._id},{$set:{progress:100,status:'done', end:new Date()}});
                }
                callback(err,downlaodUrl);
            });
        });
    }
    abort(){
        var self = this;
        self._uploader.xhr.abort();
        return new Promise(function(resolve,reject){
            if(self._uploader.status()!=="transfering") resolve();
        })
    }
}

Uploads.requestUploader = function(category,journalId,imageId,resolution){
    var self = Uploads;
    var uploader = new MyUploader(category,journalId,imageId,resolution);
    self._uploaders[uploader._id] = uploader;
    return uploader;
};
Uploads.getUploader = function(uploaderId){
    var self = Uploads;
    return   self._uploaders[uploaderId];
};
Uploads.removeUploader = function(uploadId){
    var self = Uploads;
      if(self._uploaders[uploadId])
      {
          Uploads.update({uploader:uploadId},{$set:{progress:-1}});
          delete self._uploaders[uploadId];
      }
};
Uploads.clearUploaders = function(){
    var self = Uploads;
    _.each(self._uploaders,function(uploader){
        delete self._uploaders[uploader._id]
    })
}

Images.uploadThumbs = function(images,journalId,callback){
    return Promise.all(_.map(images,function(image,idx) {
        var imageId = Random.id();
        var uploaderThumb = new Slingshot.Upload("thumbUploads", {journalId:journalId,imageId:imageId});
        console.log("Thumb uploading #" + idx, image.filename, image.dataAsUrl);

        return new Promise(function (resolve, reject) {
            uploaderThumb.send(ShareBJ.dataURL2Blob(image.dataAsUrl,image.filename), function (error, downloadUrl) {
                if (error) {
                    return reject(error);
                } else {
                    return callback(resolve,reject,journalId,idx,downloadUrl,imageId);
                }
            });
        });
    }));
};

//images [{file,},...] file is blob
//thumbsInfo {docId,imagedId,no}

Images.uploadImages = function(images,thumbsInfo,callback){
  return Promise.all(_.map(images,function(image,idx){

      thumb = _.find(thumbsInfo,function(thumb) {return thumb.no==idx});
      console.log("uploaded thumb info:",thumb);


      var width = Images.NormalQualityWidth;
      var height = Images.NormalQualityHeight;

      var uploaderImage = Uploads.requestUploader("imageUploads", thumb.docId,thumb.imageId,
          {width:_.min([width,image.exif.ImageWidth]),height:_.min([height,image.exif.ImageHeight])});
      console.log("image uploading :", image.file.name, image.file);


      return new Promise(function (resolve, reject) {
        processImage(image.file,{ maxWidth:width, maxHeight:height, quality:1 } ,function(dataURL){
              uploaderImage.send(ShareBJ.dataURL2Blob(dataURL,image.file.name), function (error, downloadUrl) {
                  if (error) {
                      return reject(error);
                  } else {
                      return callback(resolve,reject,thumb.docId,idx,downloadUrl);
                  }
              });
          });
      });
    })
  );

};

//images list of image :{file} file
Images.uploadOrigins = function(images,thumbsInfo,callback){
    var limits = Users.getUploadLimits() || {counts: 0, size: 0, quality:"high"};
    if(limits.quality != 'high'){
        return Promise.reject("Limits hited, please upgrade your account");
    }

    return Promise.all(_.map(images,function(image,idx){

            thumb = _.find(thumbsInfo,function(thumb) {return thumb.no==idx});
            console.log("uploaded thumb info:",thumb);

            var uploaderImage = Uploads.requestUploader("originUploads", thumb.docId,thumb.imageId,
                {width:image.exif.ImageWidth,height:image.exif.ImageHeight});
            console.log("origin uploading :", image.file.name, image.file);

            var limits = Users.getUploadLimits() || {counts: 0, size: 0, quality:"high"};
            return new Promise(function (resolve, reject) {
                if(limits.quality!='high'){
                    return reject(new Error("Qualilty limits hitted, please upgrade your account"));
                }
                if(!image.file.name) image.file.name = image.filename;
                uploaderImage.send(image.file, function (error, downloadUrl) {
                    if (error) {
                        return reject(error);
                    } else {
                        return callback(resolve,reject,thumb.docId,idx,downloadUrl);
                    }
                });
            });
        })
    );

};
