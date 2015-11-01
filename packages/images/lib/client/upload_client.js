function uploadDebug(...args){
    //console.log.apply(console,args);
}

class MyUploader{
    constructor(mgr,category,journalId,babyId,imageNo,resolution){
        uploadDebug(category,journalId,babyId,imageNo,resolution);
        check(category,Match.OneOf('imageUploads','originUploads'));
        check(resolution,{width:Number,height:Number});
        check(journalId,String);
        check(babyId,String);
        check(imageNo,Number);

        this._mgr = mgr;
        this._resolution = resolution;
        this._journalId = journalId;
        this._babyId = babyId;
        this._id = journalId + '-' + category + '-' + imageNo;
        this.priority = 300;
        if(category==="imageUploads")
        {
            this._category = "scaled";
            this.priority = 200;
        }
        else if(category==="originUploads")
        {
            this.priority = 100;
            this._category = "origin";
        }
        this._uploader = new Slingshot.Upload(category,{journalId:journalId,babyId:babyId,imageNo:imageNo,resolution});
    }
    send(blob,callback){
        var self = this;
        this.blob = blob;
        this.callback = callback;
        if(blob instanceof Blob){
            this.filename = blob.name;
            this.size = blob.size;
            this._mgr.append(this);
        }else if(typeof blob !== 'string' || !/^file:\/\/.*/i.test(blob)){
            throw new TypeError('must be Blob or uri with file:// scheme');
        }else{
            this.filename = blob;

            ShareBJ.getFileSize(blob,function(err,res){
                self.size = res;
                self._mgr.append(self);
            });
        }
    }
    abort(){
        return this._mgr.abort(this);
    }
}

class UploaderManager{
    constructor(max=1){
        this._uploaders = {};
        this._pendings = [];
        this._uploadings = [];
        this._maxUploads = max;
    }

    append(uploader){
        var self = this;
        if(this._uploadings.length<this._maxUploads){
            this._startUploading(uploader);
        }else {
            uploadDebug("upload pending:", uploader.filename);
            uploader.pendingAt = new Date();
            this._pendings.push(uploader);
            Uploads.insert({
                    _id: uploader._id,
                    filename: uploader.filename, size: uploader.size, category: uploader._category,
                    resolution: {
                        width: uploader._resolution.width,
                        height: uploader._resolution.height
                    },
                    status: 'pending',
                    journal: self._journalId,
                    progress: 0
                }
                , function (err, res) {
                    if (err) {
                        Uploads.update({_id:uploader._id},{$set:{
                            status:'fail',
                            end: new Date()}
                        });
                        self._pendings.splice(self._pendings.indexOf(uploader),1);
                        uploader.callback(err);
                    }
                }
            )
        }
    }

    _pushUploading(uploader){
        this._uploadings.push(uploader);
    }
    _startUploading(uploader){
        uploadDebug("upload starting:",uploader._category, uploader.filename,uploader.size);

        var self = this;
        this._pushUploading(uploader);
        uploader.uploadingAt = new Date();

        Uploads.upsert({_id:uploader._id}, {
                $set:{
                    status:'idle'
                },
                $setOnInsert: {
                    filename: uploader.filename, size: uploader.size, category: uploader._category,
                    resolution: {
                        width: uploader._resolution.width,
                        height: uploader._resolution.height
                    },
                    start: uploader.uploadingAt,
                    journal: uploader._journalId,
                    progress: 0
                }
            }
            ,function(err,res){
                if(err){
                    uploadDebug("upload status tracing error:", err);
                    return uploader.callback(err);
                }

                Tracker.autorun(function(c){
                    self._computation = c;
                    var status = uploader._uploader.status();
                    var percent = uploader._uploader.progress();
                    var now = new Date();
                    var span = (now.getTime()-uploader.uploadingAt.getTime())/1000;
                    var speed = parseInt(uploader._uploader.uploaded()/1024/span || 0);

                    Uploads.update({_id:uploader._id},{$set:{progress:Math.ceil(percent*100),status:status,speed:speed}},null);
                });

                var ret= uploader._uploader.send(uploader.blob,function(err,downloadUrl){
                    self._computation.stop();
                    self.removeUploader(uploader._uploader);

                    if(err) {
                        uploadDebug("upload fail:", uploader._category, uploader.filename);
                        Uploads.update({_id:uploader._id},{$set:{
                            progress:Math.ceil(100*uploader._uploader.progress()),
                            status:uploader._uploader.status(),
                            end: new Date()}
                        });
                        uploader.callback(err);
                    }else{
                        var now = new Date();
                        var span = (now.getTime()-uploader.uploadingAt.getTime())/1000;
                        var speed = parseInt(uploader.size/1024/span);
                        uploadDebug("upload done:",uploader._category,uploader.filename,speed,'K/S');

                        Uploads.update({_id:uploader._id},{$set:{progress:100,status:'done', end:new Date(),speed:speed}});

                        self._removeUploading(uploader);

                        uploader.callback(undefined, downloadUrl);
                    }

                });
            }
        );
    }
    abort(uploader){
         var self = this;
        return new Promise(function(resolve,reject){
            if(this._pendings.indexOf(uploader) >= 0){
                this._pendings.splice(this._pendings.indexOf(uploader),1);
                Uploads.update({_id:uploader._id},{$set:{
                    status:'abort',
                    end: new Date()}
                });

                resolve();
            }else{
                uploader._uploader.xhr.abort();
                Tracker.autorun(function(c){
                    if(uploader._uploader.status()!=="transfering"){
                        c.stop();
                        resolve();
                    }
                })
            }
        })
    }
    _removeUploading(uploader){
        this._uploadings.splice(this._uploadings.indexOf(uploader),1);
        //uploadDebug("upload done:",uploader.filename, this._uploadings.length);

        while(this._pendings.length>0 && this._uploadings.length<this._maxUploads) {
            var now = new Date();
            var idx  = 0;
            for(var i=1;i<this._pendings.length;i++){
                if(this._pendings[i].priority > this._pendings[idx].priority)
                {
                    idx = i;
                }
            }
            nextUploader = this._pendings[idx];
            this._pendings.splice(idx,1);

            uploadDebug("pending time:", (now.getTime() - nextUploader.pendingAt.getTime())/1000,'S');
            this._startUploading(nextUploader);
        }
    }
    requestUploader(category,journalId,babyId,imageNo,resolution){
        var self = this;
        var uploader = new MyUploader(self,category,journalId,babyId,imageNo,resolution);
        self._uploaders[uploader._id] = uploader;
        return uploader;
    }
    getUploader(uploaderId){
        return   this._uploaders[uploaderId];
    }
    removeUploader(uploadId){
        var self = this;
          if(self._uploaders[uploadId])
          {
              self.update({uploader:uploadId},{$set:{progress:-1}});
              delete self._uploaders[uploadId];
          }
    }
    clearUploaders(){
        var self = this;
        _.each(self._uploaders,function(uploader){
            delete self._uploaders[uploader._id]
        })
    }
}

Images.uploadManager = new UploaderManager();

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


      var uploaderImage = Images.uploadManager.requestUploader("imageUploads", thumb.docId, thumb.babyId, thumb.no,
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

            var uploaderImage = Images.uploadManager.requestUploader("originUploads", thumb.docId,thumb.babyId,thumb.no,
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
