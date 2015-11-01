function cacheDebug(){
    if(Images.cacheDebug)
        console.log.apply(console,arguments);
}
class Storage{
    constructor(options){
        this.settings = new Ground.Collection('storage',{connection:null});
        this.ready = new ReactiveVar(false);
        this.hasExternal = true;
        if(Meteor.isCordova)
        {
            this.hasExternal = cordova.file.externalDataDirectory!==null;
            this.externalDir = cordova.file.externalDataDirectory + 'images_cache';
            this.internalDir = cordova.file.dataDirectory + 'images_cache';
        }
        this.externalFirst = this.hasExternal || true;
        this.externalEnable = this.hasExternal || true;
        this.internalEnable = true;
        if(this.settings.find({}).count()===0)
        {
            this.settings.insert({
                hasExternal:this.hasExternal,
                externalDir:this.externalDir,
                internalDir:this.internalDir,
                externalEnable:this.externalEnable,
                internalEnable:this.internalEnable,
                externalFirst: this.externalFirst
            });
        }
    }

    _saveSettings(){
        this.settings.update({},{
            $set:{
                hasExternal:this.hasExternal,
                externalDir:this.externalDir,
                internalDir:this.internalDir,
                externalEnable:this.externalEnable,
                internalEnable:this.internalEnable,
                externalFirst: this.externalFirst
            }
        });
    }
    init(options){
        if(options.externalFirst)
            this.externalFirst = options.externalFirst;
        if(options.externalEnable)
            this.externalEnable = options.externalEnable;
        if(options.internalEnable )
            this.internalEnable = options.internalEnable;

        var self = this;

        var bExternalReady = false;
        var bInternalReady = false;

        if(cordova.file.externalDataDirectory){
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,gotDirectoryEntryExt,ext_fail);
            function gotDirectoryEntryExt(de){
                de.getDirectory('images_cache',{create:true,exclusive:false},
                    function(dirEntry){
                        //console.log(dirEntry);
                        dirEntry.getDirectory('local',{create:true,exclusive:false},function(localDir){
                            bExternalReady = true;
                            if(bInternalReady)
                            {
                                updateSettings();
                                self.ready.set(true);
                            }
                            cacheDebug('external local cache dir',localDir,bInternalReady,bExternalReady);
                        },ext_fail);
                    },ext_fail)
            }
            function ext_fail(err){
                cacheDebug(err);
                this.hasExternal = false;
            }
        }else{
            bExternalReady = true;
        }
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory,gotDirectoryEntry,fail);
        function gotDirectoryEntry(de){
            de.getDirectory('images_cache',{create:true,exclusive:false},
                function(dirEntry){
                    //console.log(dirEntry);
                    dirEntry.getDirectory('local',{create:true,exclusive:false},function(localDir){
                        bInternalReady = true;
                        if(bExternalReady || !self.hasExternal)
                        {
                            updateSettings();
                            self.ready.set(true);
                        }
                        cacheDebug('internal local cache dir:',localDir,bInternalReady,bExternalReady);
                    },fail);
                },fail)
        }
        function fail(err){
            cacheDebug(err);
            this.internalEnable = false;
        }

        function updateSettings(){
            self._saveSettings();
        }

    }
    getStorageLocation(filename)
    {
        if(this.hasExternal && this.externalEnable &&  this.externalFirst)
        {
            return  this.externalDir + (filename || '');
        }else{
            return  this.internalDir + (filename || '');
        }
    }

    getFreeSpace(){
        var self = this;
        cordova.exec(function(result/*K*/){
            self.settings.update({},{$set: {
                available:result
            }});
        },function(err){
            cacheDebug(err);
        },"File","getFreeDiskSpace",[]);
    }

    getFreeSpace2(callback){
        function querySize(expectSize,okCB,failCB){
            window.requestFileSystem(LocalFileSystem.PERSISTENT,expectSize,function(fs){
                okCB(expectSize);
            },function(err){
                failCB(expectSize);
            })
        }
        var base = 0;
        var upper = 128*1024*1024*1024;//128G

        querySize(upper-base,queryOK,queryFail);

        function queryOK(size){
            if(upper-base < 1024)//stop
            {
                callback(size);
            }
            base = upper;
            querySize(size+(upper-base)/2,queryOK,queryFail);
        }
        function queryFail(size){
            upper = size;
            if(upper<=base)
            {
                callback(0);
            }else{
                querySize(size-(upper-base)/2,queryOK,queryFail);
            }
        }
    }
}

class ImageCacheIndex{
     constructor(){
         this.indexes = new Ground.Collection(null);
         this.stat = new Ground.Collection('stat',{connection:null});

         var self = this;
         Tracker.autorun(function(){
             self._stat();
         })
     }
    init(){
        //if(this.stat.find({}).count()===0)
        //{
        //    console.log("collect stat from caches");
        //    this._stat();
        //}
    }
    ready(){
        return this.indexes.ready();
    }
     insert(uri,cacheURI,size,orientation=1){
         var self = this;
         var id = this.indexes.insert({_id:uri,cached_uri:cacheURI,size:size,orientation:orientation,cachedAt:new Date()},insertCB);
         function insertCB(err, id){
             if(err){
                 cacheDebug(err);
             }else{
                 cacheDebug("cache inserted",id,uri);
             }
         }
     }

    update(uri,cacheURI,size,orientation=1){
        this.indexes.update({_id:uri},{$set:{cached_uri:cacheURI,size:size,orientation:orientation,cachedAt:new Date()}});
    }
     hit(uri){
         var self = this;
         return new Promise(function(resolve,reject){
             Tracker.autorun(function(c){
                 var r = self.indexes.findOne({_id:uri});
                 if(!r){
                     c.stop();
                     cacheDebug("miss:",uri);
                     reject('no cache')
                 }else if(r.cached_uri){
                     c.stop();
                     cacheDebug("hit:",uri,r.cached_uri);
                     resolve(r.cached_uri)
                 }else{ //downloading, wait
                     //set timeout for downloading
                     if(c.firstRun){
                         Meteor.setTimeout(function(){
                             c.stop();
                            reject('downloading timeout');
                         },1000*60*30)
                     }
                 }
             })
         })
     }

    renameURI(uri,newURI) {
        var r = this.indexes.findOne({_id:uri});
        this.indexes.remove({_id:uri});
        this.indexes.upsert({_id:newURI},{$set:{cached_uri:r.cached_uri,size:r.size,orientation:r.orientation,cachedAt:new Date()}});
    }
    remove(cononicalURI){
        this.indexes.remove({_id:cononicalURI},function(err,num){
            if(err || num!==1){
                cacheDebug(err,num);
            }
        });
    }
    removeByCachedURI(cached_uri){
        this.indexes.remove({cached_uri:cached_uri},function(err,num){
            if(err || num!==1){
                cacheDebug(err,num);
            }
        });
    }

    /**
     *
     * @returns {{map: Map, externalNumber: number, internalNumber: number, externalSize: number, internalSize: number}}
     */
    _stat(){
        var caches = this.indexes.find().fetch();
        //console.log(caches);
        var extNumber = 0;
        var extSize = 0;
        var intSize = 0;
        _.each(caches,function(cache){
            if(cache.cached_uri){//exclude caching item
                if(cache.cached_uri.startsWith(cordova.file.externalRootDirectory))
                {
                    extNumber++;
                    extSize += cache.size;
                }else{
                    intSize += cache.size;
                }
            }
        });
        this.stat.update({},{
                $set: {
                    externalNumber:extNumber,
                    externalSize:extSize,
                    internalNumber:caches.length - extNumber,
                    internalSize: intSize,
                    createdAt: new Date()
                }
            },
            {
                upsert:true
            },
            function(){
                //console.log("update stat：",extNumber,extSize,caches.length - extNumber,intSize)
            }
        );
    }
 }

function canonical(uri){
    var a = document.createElement('a');
    a.href = uri;
    var last = false;

    return a.port? (a.protocol + '//' + a.host + ':' + a.port + a.pathname) :  (a.protocol+'//'+a.host+a.pathname);
};


class CacheManager {
    constructor(){
        this.index = new ImageCacheIndex();
        this.storage = new Storage();
    }
    init(options){
        this.storage.init(options);
        this.index.init();
    }
    ready(){
        return this.storage.ready.get();
    }
    /**
     *
     * @param uri
     * @param callback
     * @returns {*}
     */
    cache(uri,orientation,callback){
        var self = this;

        if(/^file:\/\/.*/i.test(uri)){ //move to cache directory
            self.logCache(uri,null,-1,1);
            self.moveToCache(uri).then(function(res){
                self.updateCache(uri,res.cachedURI,res.size,orientation);
                callback(res.cachedURI);
            },function(err){
                cacheDebug(err);
                self.index.remove(uri);
                callback(uri);//fallback to origin
            })
        }else{
            self.hit(uri).then(function(cachedURI){
                callback(cachedURI);
            },function(err){
                //
                self.logCache(uri,null,-1,1);
                self.download(uri).then(function(res){
                    self.updateCache(uri,res.cachedURI,res.size,orientation);
                    callback(res.cachedURI)
                },function(err){
                    cacheDebug(err);
                    self.index.remove(uri);
                    callback(uri);//fallback to origin
                });
            })
        }
    }

    renameURI(uri,newURI){
        this.index.renameURI(uri,newURI);
    }

    logCache(uri,cacheURI,size,orientation=1){
        this.index.insert(canonical(uri),cacheURI,size,orientation);
    }
    updateCache(uri,cacheURI,size,orientation=1){
        this.index.update(canonical(uri),cacheURI,size,orientation);
    }

    /**
     *
     * @param uri
     * @returns {*}
     */
    hit(uri){
        var self = this;
        return new Promise(function(resolve,reject){
            var canonicalURI = canonical(uri);

            self.index.hit(canonicalURI)
            .then(function(cachedURI){
                //check index broken
                window.resolveLocalFileSystemURL(cachedURI,exists,not_exists);
                function exists(){
                    resolve(cachedURI)
                }
                function not_exists(error){
                    //fix cache index
                    cacheDebug('remove broken cache:',canonicalURI,cachedURI);
                    self.index.remove(canonicalURI);
                    reject(new Error("cache broken"))
                }
            },function(err){
                if(err!=='no cache'){
                    cacheDebug('Error:'+err);
                }
                reject(err);
            })
        })
    }

    download(uri){
        var self = this;
        var makeCacheURL = function(uri){
            var a = document.createElement('a');
            a.href = uri;
            var last = false;

            var newURI = self.storage.getStorageLocation(a.pathname);
            return newURI;
        };
        return new Promise(function(resolve,reject){
            var downloader = Images.downloadManager.requestDownloader();
            var fileURL = makeCacheURL(uri);

            downloader.download(uri,fileURL,function(res){
                    resolve(res);
            },errorHanlder);

            function errorHanlder(err){
                reject(err);
            }
        });
    }

    moveToCache(uri){
        var self = this;
        return new Promise(function(resolve,reject){
            var errorHandler = function(err){
                cacheDebug(err);
                reject(err);
            };

            window.resolveLocalFileSystemURL(uri,function(fileEntry){
                window.resolveLocalFileSystemURL(self.storage.getStorageLocation()+'/local',
                    function(dirEntry){
                        var suffix = uri.match(/.*(\.[^\.]+)$/i)[1];
                        var newFilename = Random.id() + suffix;
                        fileEntry.moveTo(dirEntry,newFilename,function(res){
                            res.file(function(blob){
                                resolve({cachedURI:res.toURL(),size:blob.size});
                            },errorHandler)
                        },errorHandler);
                    }, errorHandler)
            })
        });
    }

    getThumbnailURI(uri){
        var parts = uri.match(/^(.*)\/(.*)\.([^\.]*)$/i);
        var dir =  parts[1];
        var thumbFilename = parts[2]+'-thumbnail.'+ parts[3];
        var thumbURI = dir + '/' + thumbFilename;
        return new Promise(function(resolve,reject){
            window.resolveLocalFileSystemURL(thumbURI,function(fileEntry){
                if(fileEntry.isFile)
                {
                    resolve(thumbURI)
                }else{
                    reject("not a file");
                }
            },createThumb);

            function createThumb(err){
                //not exists, try to create one
                window.imageResizer.resizeImage(
                    function (data) {
                        resolve(dir + '/' + data.filename);
                    },
                    function (err) {
                        reject(err);
                    },
                    uri, Images.ThumbWidth,Images.ThumbHeight,
                    {
                        imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                        resizeType: ImageResizer.RESIZE_TYPE_MAXPIXEL,
                        quality: 100,
                        storeImage: true,
                        directory: dir,
                        filename: thumbFilename,
                        pixelDensity: false,
                        photoAlbum:false
                    }
                )
            }
        })
    }

    isCacheFileExists(uri,fix, callback){
        var self = this;
        window.resolveLocalFileSystemURL(uri,function(fileEntry) {
            if (fileEntry.isFile) {
                callback(undefined,true);
            } else {
                fixCahce(uri);
                callback("not a file");
            }
        },function(err){
            fixCahce(uri);
            callback(err);
        });

        function fixCahce(uri){
            self.index.removeByCachedURI(uri);
        }
    }
}

Images.cacheManager = new CacheManager();

var openCacheDB = function(){
    if(Meteor.isCordova){
        Images.cacheManager.init({
            externalFirst:true
        });
    }
};

if(!Meteor.isCordova){
    Images.cacheManager.cache = function(uri,orientation,callback){
            cacheDebug('no cache system',uri);
            callback(uri)
        }
}

ShareBJ.deviceReadyCallbacks.push(openCacheDB);

