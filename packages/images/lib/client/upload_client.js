class MyUploader{
    constructor(category,journalId,babyId,imageNo,resolution){
        console.log(category,journalId,babyId,imageNo,resolution);
        check(category,Match.OneOf('imageUploads','originUploads'));
        check(resolution,{width:Number,height:Number});
        check(journalId,String);
        check(babyId,String);
        check(imageNo,Number);

        this._resolution = resolution;
        this._journalId = journalId;
        this._babyId = babyId;
        this._id = journalId + '-' + imageNo;
        if(category==="imageUploads")
            this._category = "scaled";
        else if(category==="originUploads")
            this._category = "origin";
        this._uploader = new Slingshot.Upload(category,{journalId:journalId,babyId:babyId,imageNo:imageNo,resolution});
    }
    send(blob,callback){
        var self = this;
        console.log("send args:",blob);
        var filename,size;
        if(blob instanceof Blob){
            filename = blob.name;
            size = blob.size;
            doSend();
        }else if(typeof blob !== 'string' || !/^file:\/\/.*/i.test(blob)){
            throw new TypeError('must be Blob or uri with file:// scheme');
        }else{
            filename = blob;
            ShareBJ.getFileSize(blob,function(err,res){
                size = res;
                doSend();
            });
        }

        var doSend =function(){
            console.log("upload size:",size);
            Uploads.insert({uploader:self._id,filename:filename,size:size,category:self._category,
                        resolution:{
                            width:self._resolution.width,
                            height:self._resolution.height
                        },
                        start:new Date(),
                        journal:self._journalId,progress:0}
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
    }
    abort(){
        var self = this;
        self._uploader.xhr.abort();
        return new Promise(function(resolve,reject){
            Tracker.autorun(function(c){
                if(self._uploader.status()!=="transfering"){
                    c.stop();
                    resolve();
                }
            })
        })
    }
}

Uploads.requestUploader = function(category,journalId,babyId,imageNo,resolution){
    var self = Uploads;
    var uploader = new MyUploader(category,journalId,babyId,imageNo,resolution);
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

Images.uploadThumbs = function(images,journalId,babyId,callback){
    return Promise.all(_.map(images,function(image,idx) {
            var imageId = idx;
            var uploaderThumb = new Slingshot.Upload("thumbUploads", {journalId: journalId, babyId: babyId, imageNo: idx});
            console.log("Thumb uploading #" + idx, image.filename, image.thumb);

            return new Promise(function (resolve, reject) {
                uploaderThumb.send(ShareBJ.dataURL2Blob(image.thumb.url, image.origin.uri.match(/.*([^\/]+)$/)[1]),
                    function (error, downloadUrl) {
                        if (error) {
                            return reject(error);
                        } else {
                            return callback(resolve, reject, journalId, idx, downloadUrl, babyId);
                        }
                    }
                )
            })
        }));
};

//images [{file,},...] file is blob
//thumbsInfo {docId,imagedId,no}

Images.uploadImages = function(images,thumbsInfo,callback){
  return Promise.all(_.map(images,function(image,idx) {

      thumb = _.find(thumbsInfo, function (thumb) {
          return thumb.no == idx
      });
      console.log("uploaded thumb info:", thumb);


      var uploaderImage = Uploads.requestUploader("imageUploads", thumb.docId, thumb.babyId, thumb.no,
          {width: image.image.width, height: image.image.height});
      console.log("image uploading :", image.image.uri);


      return new Promise(function (resolve, reject) {
          Tracker.autorun(function (c) {
              if (image.scaleDone) {
                  c.stop();
                  uploaderImage.send(image.image.uri, function (error, downloadUrl) {
                      if (error) {
                          return reject(error);
                      } else {
                          return callback(resolve, reject, thumb.docId, idx, downloadUrl);
                      }
                  })
              }
          });
      });
  }));
};

//images list of image :{file} file
Images.uploadOrigins = function(images,thumbsInfo,callback){
    var limits = Session.get('UploadLimits');
    if(limits && limits.quality !== 'high'){
        return Promise.reject("Limits hited, please upgrade your account");
    }

    return Promise.all(_.map(images,function(image,idx){

            thumb = _.find(thumbsInfo,function(thumb) {return thumb.no==idx});
            console.log("uploaded thumb info:",thumb);

            var uploaderImage = Uploads.requestUploader("originUploads", thumb.docId,thumb.babyId,thumb.no,
                {width:image.origin.width,height:image.origin.height});
            console.log("origin uploading :", image.origin.uri);

            return new Promise(function (resolve, reject) {
                //if(!image.file.name) image.file.name = image.filename;
                uploaderImage.send(image.origin.file || image.origin.uri, function (error, downloadUrl) {
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
