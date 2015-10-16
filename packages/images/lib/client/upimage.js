UpImage = class UpImage {
    constructor(){
        this.thumb = {
            url:undefined,  // BASE64 dataurl
            type:undefined,
            width: undefined,
            height: undefined
        };
        this.image = {
            uri:undefined,
            type:undefined,
            dataURL:undefined,
            width:undefined,
            height:undefined
        };
        this.origin ={
            uri:undefined,
            type:undefined,
            width:undefined,
            height:undefined,
            orientation:undefined,
            takenAt:undefined
        };
        this._scaleOK = ReactiveVar(false);
    };

    get scaleDone(){
        return this._scaleOK.get();
    }

    /**
     * create a scaled image from origin, work on cordova environment
     * @param uri   uri of origin image file
     * @param options {save:Boolean} if scaled image save to file
     * @returns {Promise} return UpImage when success, otherwise return error
     * @private
     */
     _createImage(uri,options){
         var self = this;
         var dir = uri.replace(/\/([^\/]*)$/,'') + '/images';
         return new Promise(function(resolve,reject){
             var factor = Images.getImageScaleFactor();
             window.imageResizer.resizeImage(
                 function (data) {
                     if(options && options.save){
                         self.image.uri = dir + '/' + data.filename;
                     }else{
                         self.image.dataURL ="data:image/jpeg;base64," + data.imageData;
                     }
                     self.image.type = 'jpeg';
                     self.image.width = data.width;
                     self.image.height = data.height;
                     resolve(self);
                 },
                 function (err) {
                     reject(new Error(err));
                 },
                 uri,
                 factor.width,
                 factor.height,
                 {
                     //format: this.type,
                     imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                     resizeType: ImageResizer.RESIZE_TYPE_MAXPIXEL,
                     quality: factor.quality,
                     storeImage: options && options.save,
                     directory: dir,
                     filename: Random.id()+'.jpg',
                     pixelDensity: false,
                     photoAlbum:false
                 }
             )
         })
    };
    /**
     * create a thumbnail from origin, work on cordova environment
     * @param uri   uri of origin image file
     * @returns {Promise}   return UpImage when success, otherwise return error
     * @private
     */
    _createThumbnail(uri){
        var self = this;
        return new Promise(function(resolve, reject){
            window.imageResizer.resizeImage(
                function (data) {
                    self.thumb.type = "jpeg";
                    self.thumb.url = "data:image/jpeg;base64," + data.imageData;
                    self.thumb.width = data.width;
                    self.thumb.height = data.height;
                    resolve(self);
                },
                function (err) {
                    reject(new Error(err));
                },
                uri, Images.ThumbWidth, Images.ThumbHeight,
                {
                    imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                    resizeType: ImageResizer.RESIZE_TYPE_MAXPIXEL,
                    quality: 100,
                    storeImage: false,
                    pixelDensity: false
                }
            )
        })
    }

    /**
     * get image's orientation, width, height and when taken
     * @param uri  uri or dataURL of image
     * @param isBase64 if dataURL
     * @returns {Promise} return {width, height, orientation,takenAt} orientation,takenAt is optional
     * @private
     */
    static _getImageInfo(uri,isBase64=false){
        return new Promise(function(resolve,reject){
            EXIF.readExifFromFileURI(uri, function (exifdata) {
                if(exifdata){
                    resolve({
                        width: exifdata.ImageWidth,
                        height: exifdata.ImageHeight,
                        orientation: exifdata.Orientation,
                        takenAt: exifdata.DateTime
                    })
                }else{
                    window.imageResizer.getImageSize(function(data){
                            resolve(data);
                        },function(err){
                            reject(err)
                        },
                        uri,{imageDataType: isBase64?ImageResizer.IMAGE_DATA_TYPE_BASE64: ImageResizer.IMAGE_DATA_TYPE_URL}
                    )
                }
            })
        })
    }

    /**
     * attach existing uri as the image, and load exif and then create a thumbnail and create a normal image saving to disk
     * @param uri
     * @returns {Promise} return a promise of creating scaled image when sucess
     */
    attachURI(uri){
        if(SBJ_DEBUG) console.time('attachURI took time');
        var self  = this;
        this.origin.uri = uri;
        return new Promise(function(resolve,reject) {
            UpImage._getImageInfo(uri)
            .then(function(data){
                if(SBJ_DEBUG) console.log("Image info:",data);
                self.origin.width = data.width;
                self.origin.height = data.height;
                self.origin.takenAt = data.takenAt;
                self.origin.orientation = data.orientation;
                //create thumbnail
                self._createThumbnail(uri)
                    .then(function(){   //thumbnail created
                        if (SBJ_DEBUG) console.timeEnd('attachURI took time');
                        Meteor.setTimeout(function(){
                            self._createImage(uri,{save:true})
                            .then(function(){   //image created
                                self._scaleOK.set(true);
                            });
                        })
                        resolve(self);
                    })
                    .catch(function(err){   //error
                        reject(err);
                    })
            })
        });
    };

    /**
     * atach a File as the image, load exif and then create a thumbnail and a normal image in form of Blob
     * @param file
     * @returns {Promise}
     */
    attachFile(file){
        var self = this;
        var url = window.URL || window.webkitURL;
        this.origin.file = file;
        this.origin.uri = url.createObjectURL(file);

        this.origin.type = file.type.match(/^image\/(.*)$/i)[1];
        return new Promise(function(resolve,reject) {
            EXIF.readExifFromFileURI(file, function (exifdata) {
                if (exifdata) {
                    self.origin.orientation = exifdata.Orientation;
                    self.origin.width = exifdata.ImageWidth;
                    self.origin.height = exifdata.ImageHeight;
                    self.origin.takenAt = exifdata.DateTime;
                }
                processImage(file, {maxWidth:Images.ThumbWidth, maxHeight:Images.ThumbHeight,quality: 1,exif:exifdata},
                    function (data,width,height) {
                        self.thumb.url = data;
                        self.thumb.type = 'jpeg';
                        self.thumb.width = width;
                        self.thumb.height = height;

                        var factor = Images.getImageScaleFactor();
                        processImage(file, {maxWidth:factor.width, maxHeight:factor.height,quality: factor.quality,exif:exifdata},
                            function(res,w,h){
                                self.image.uri = window.dataURLtoBlob(res);
                                self.image.uri.name = file.name;
                                self.image.type = 'jpeg';
                                self.image.width = w;
                                self.image.height = h;
                                self.image.dataURL = res;
                                self._scaleOK.set(true);
                                resolve(self);
                            }
                        )
                    }
                );

            });
        })
    }
    /**
     * attach existing _dataURL as the image, and then create a thumbnail, then save image to a file
     * @param imageData image base64 data url
     * @returns {Promise}
     */
    attachDataURL(imageData){
        var self = this;
        this.type = imageData.match(/^data\:image\/([^\;]+)\;base64,/mi)[1];
        this._dataURL = imageData;
        return new Promise(function(resolve,reject){
            var save = function(){
                var filename = Random.id();
                window.imageResizer.storeImage(
                    function(data){
                        this.filename = filename;
                        resolve(data)
                    },
                    function(err){//fail
                        reject(new Error(err));
                    },
                    image,
                    {
                        format:ImageResizer.FORMAT_JPG,
                        imageType:ImageResizer.IMAGE_DATA_TYPE_URL,
                        filename:filename,
                        directory:Images.CacheDirectory,
                        quality:100,

                    }
                )
            };

            window.imageResizer.resizeImage(
                function(data,height,width){
                    self.thumb =  "data:image/"+this.type+";base64," + data.imageData;
                    self.thumbWidth = data.width;
                    self.thumbHeight = data.height;

                    save(resolve,reject,imageData);
                },
                function(err){
                    reject(new Error(err));
                },
                imageData, Images.ThumbWidth, Images.ThumbHeight,
                {
                    format: this.type,
                    imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                    resizeType:ImageResizer.RESIZE_TYPE_MAXPIXEL,
                    quality:75,
                    storeImage:0,
                    pixelDensity:0
                }
            )
        })
    };

    debugOutput(){
        console.log("Upimage:",this.type,this.filename, this.thumb,this._dataURL,this.uri,this.exif);
    };
}
