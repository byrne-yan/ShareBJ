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
                            console.log('external local cache dir',localDir,bInternalReady,bExternalReady);
                        },ext_fail);
                    },ext_fail)
            }
            function ext_fail(err){
                console.log(err);
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
                        console.log('internal local cache dir:',localDir,bInternalReady,bExternalReady);
                    },fail);
                },fail)
        }
        function fail(err){
            console.log(err);
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
            console.log(err);
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
         var id = this.indexes.insert({uri:uri,cached_uri:cacheURI,size:size,orientation:orientation,cachedAt:new Date()},insertCB);
         function insertCB(err, id){
             if(err){
                 console.log(err);
             }else{
                 console.log("cache inserted",id,uri);
             }
         }
     }

     hit(uri){
         var self = this;
         return new Promise(function(resolve,reject){
             var c = self.indexes.findOne({uri:uri});
             if(c){
                 console.log("hit:",uri,c.cached_uri);
                 resolve(c.cached_uri)
             }else{
                 console.log("miss:",uri);
                 reject('no cache')
             }
         })
     }

    renameURI(uri,newURI) {
        this.indexes.update({uri:uri},{$set:{uri:newURI}});
    }
    remove(cononicalURI){
        var r = this.indexes.findOne({uri:cononicalURI});
        this.indexes.remove({uri:cononicalURI},function(err,num){
            if(err || num!==1){
                console.log(err,num);
            }
        });
    }

    /**
     *
     * @returns {{map: Map, externalNumber: number, internalNumber: number, externalSize: number, internalSize: number}}
     */
    _stat(){
        var caches = this.indexes.find().fetch();
        console.log(caches);
        var extNumber = 0;
        var extSize = 0;
        var intSize = 0;
        _.each(caches,function(cache){
            if(cache.cached_uri.startsWith(cordova.file.externalRootDirectory))
            {
                extNumber++;
                extSize += cache.size;
            }else{
                intSize += cache.size;
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
                console.log("update stat：",extNumber,extSize,caches.length - extNumber,intSize)
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
            self.moveToCache(uri).then(function(res){
                self.logCache(uri,res.cachedURI,res.size,orientation);
                callback(res.cachedURI);
            },function(err){
                console.log(err);
                callback(uri);//fallback to origin
            })
        }else{
            self.hit(uri).then(function(cachedURI){
                callback(cachedURI);
            },function(err){
                self.download(uri).then(function(res){
                    self.logCache(uri,res.cachedURI,res.size,orientation);
                    callback(res.cachedURI)
                },function(err){
                    console.log(err);
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

                    function exists(){resolve(cachedURI)};
                    function not_exists(error){
                        //fix cache index
                        self.index.remove(canonicalURI);
                        reject(new Error("cache broken"))
                    }
            },function(err){
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
            var downloader = new FileTransfer();
            var fileURL = makeCacheURL(uri);
            console.log('downloading ' + uri +' to '+ fileURL);
            downloader.download(uri,fileURL,function(entry){
                console.log('downloaded');
                entry.file(function(blob){
                    resolve({
                        cachedURI:entry.toURL(),
                        size:   blob.size
                    });
                },errorHanlder);
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
                console.log(err);
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
    Images.cacheManager.cache = function(uri,callback){
            console.log('no cache system',uri);
            callback(uri)
        }
}

ShareBJ.deviceReadyCallbacks.push(openCacheDB);

