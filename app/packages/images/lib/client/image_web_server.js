if(Meteor.isCordova){
    var startImageServer = function(){
        httpd = cordova && cordova.plugins && cordova.plugins.CorHttpd;
        if(!httpd){
            throw new Error("No CorHttpd found!");
        }

        var start = function(){

            if(!Images.cacheManager.storage.internalDir)
            {
                Meteor.setTimeout(start,100);
                return;
            }
            paths = {};
            Images.server.local_path = cordova.file.applicationStorageDirectory.substring(7);
            Images.server.local_path_cache = cordova.file.cacheDirectory.substring(7);
            Images.server.local_path_data = cordova.file.dataDirectory.substring(7);

            Images.server.image_cache_path = Images.cacheManager.storage.internalDir.substring(7);
            paths[Images.server.image_cache_url] = Images.server.image_cache_path;

            if(cordova.file.externalDataDirectory)
            {
                Images.server.local_ext_path = cordova.file.externalApplicationStorageDirectory.substring(7);
                Images.server.local_ext_path_cache = cordova.file.externalCacheDirectory.substring(7);
                Images.server.local_ext_path_data = cordova.file.externalDataDirectory.substring(7);

                paths[Images.server.ext_url] = Images.server.local_ext_path;
            }

            if(Images.cacheManager.storage.externalDir){
                Images.server.image_cache_ext_path = Images.cacheManager.storage.externalDir.substring(7);
                paths[Images.server.image_cache_ext_url] = Images.server.image_cache_ext_path;
            }

            httpd.startServer({
                'www_root': Images.server.local_path,
                'port':8403,
                'localhost_only':false,
                'custom_paths': paths
            },function(url){
                Images.server.url = url;

                console.log("Image server run on " + url);
                httpd.getLocalPath(function(path){
                    console.log("Image server work on local path:"+path);
                })
            },function(err){
                throw new Error(err);
            })
        };

        httpd.getURL(function(url){
            if(url.length > 0 ){
                httpd.stopServer(function(){
                    start();
                },function(err){
                    throw new Error('Can not stop image server:'+err);
                })
            }else{
                start();
            }
        })
    };

    ShareBJ.deviceReadyCallbacks.push(startImageServer);

    Images.server.remapuriAsync = function(uri,callback){
        var newURI = Images.server.remapuri(uri);
        Images.cacheManager.isCacheFileExists(uri,true,function(err,res){
            if(!err && res)
                callback(undefined,newURI);
            else
                callback(undefined,uri);
        });

    };
    Images.server.remapuri = function(uri){
        var url = Images.server.url;
        var mappedURI = uri;
        if(/^file:\/\/.*/i.test(uri)) {
            var path = uri.replace(/^file:\/\//i, '');
            if (Images.cacheManager.storage.externalDir && 0 === path.indexOf(Images.server.image_cache_ext_path)) {

                mappedURI = url + Images.server.image_cache_ext_url + path.substring(Images.server.image_cache_ext_path.length);
            }else if (0 === path.indexOf(Images.server.image_cache_path)) {

                mappedURI = url + Images.server.image_cache_url + path.substring(Images.server.image_cache_path.length);
            }else if (0 === path.indexOf(Images.server.local_path_cache)) {

                mappedURI = url + Images.server.cache_url + path.substring(Images.server.local_path_cache.length);

            } else if (0 === path.indexOf(Images.server.local_path_data)) {

                mappedURI = url + path.substring(Images.server.local_path_data.length);

            } else if (0 === path.indexOf(Images.server.local_path)) {

                mappedURI = url + Images.server.data_url + path.substring(Images.server.local_path_data.length);

            } else if (cordova.file.externalApplicationStorageDirectory && 0 === path.indexOf(Images.server.local_ext_path_cache)) {

                mappedURI = url + Images.server.ext_cache_url + path.substring(Images.server.local_ext_path_cache.length);

            } else if (cordova.file.externalApplicationStorageDirectory && 0 === path.indexOf(Images.server.local_ext_path_data)) {

                mappedURI = url + Images.server.ext_data_url + path.substring(Images.server.local_ext_path_data.length);

            } else if (cordova.file.externalApplicationStorageDirectory && 0 === path.indexOf(Images.server.local_ext_path)) {

                mappedURI = url + Images.server.ext_url + path.substring(Images.server.local_ext_path.length);
            }
        }
        //console.log('warn: not remap,',uri);
         return mappedURI;
    }
}else
{
    Images.server = {
        remapuri: function(uri){
            return uri;
        }
    }
}