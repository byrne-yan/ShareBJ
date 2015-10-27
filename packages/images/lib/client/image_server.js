if(Meteor.isCordova){
    var startImageServer = function(){
        httpd = cordova && cordova.plugins && cordova.plugins.CorHttpd;
        if(!httpd){
            throw new Error("No CorHttpd found!");
        }

        var start = function(){

            paths = {};
            Images.server.local_path = cordova.file.applicationStorageDirectory.substring(7);
            Images.server.local_path_cache = cordova.file.cacheDirectory.substring(7);
            Images.server.local_path_data = cordova.file.dataDirectory.substring(7);
            Images.server.image_cache_path = cordova.file.dataDirectory.substring(7)+'/images_cache';
            if(cordova.file.externalApplicationStorageDirectory)
            {
                Images.server.local_ext_path = cordova.file.externalApplicationStorageDirectory.substring(7);
                Images.server.local_ext_path_cache = cordova.file.externalCacheDirectory.substring(7);
                Images.server.local_ext_path_data = cordova.file.externalDataDirectory.substring(7);
                Images.server.image_cache_ext_path = cordova.file.externalDataDirectory.substring(7)+'/images_cache';
            }


            paths[Images.server.ext_url] = Images.server.local_ext_path;
            paths[Images.server.image_cache_url] = Images.server.image_cache_path;
            paths[Images.server.image_cache_ext_url] = Images.server.image_cache_ext_path;

            httpd.startServer({
                'www_root': Images.server.local_path,
                'port':8403,
                'localhost_only':false,
                'custom_paths': paths
            },function(url){
                Images.server.url = url;
                //var a = document.createElement('a');
                //a.href = url;
                //Images.server.meteor_url = a.protocol + '//' + 'meteor.local' + ':' + a.port;

                console.log("Image server run on " + url/*, Images.server.meteor_url*/);
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

    Images.server.remapuri = function(uri, meteorWay=false){
        var url = meteorWay?Images.server.meteor_url:Images.server.url;

        if(/^file:\/\/.*/i.test(uri)) {
            var path = uri.replace(/^file:\/\//i, '');
            if (cordova.file.externalApplicationStorageDirectory && 0 === path.indexOf(Images.server.image_cache_ext_path)) {

                return url + Images.server.image_cache_ext_url + path.substring(Images.server.image_cache_ext_path.length);
            }else if (0 === path.indexOf(Images.server.image_cache_path)) {

                return url + Images.server.image_cache_url + path.substring(Images.server.image_cache_path.length);
            }else if (0 === path.indexOf(Images.server.local_path_cache)) {

                return url + Images.server.cache_url + path.substring(Images.server.local_path_cache.length);

            } else if (0 === path.indexOf(Images.server.local_path_data)) {

                return url + path.substring(Images.server.local_path_data.length);

            } else if (0 === path.indexOf(Images.server.local_path)) {

                return url + Images.server.data_url + path.substring(Images.server.local_path_data.length);

            } else if (cordova.file.externalApplicationStorageDirectory && 0 === path.indexOf(Images.server.local_ext_path_cache)) {

                return url + Images.server.ext_cache_url + path.substring(Images.server.local_ext_path_cache.length);

            } else if (cordova.file.externalApplicationStorageDirectory && 0 === path.indexOf(Images.server.local_ext_path_data)) {

                return url + Images.server.ext_data_url + path.substring(Images.server.local_ext_path_data.length);

            } else if (cordova.file.externalApplicationStorageDirectory && 0 === path.indexOf(Images.server.local_ext_path)) {

                return url + Images.server.ext_url + path.substring(Images.server.local_ext_path.length);
            }
        }
        //console.log('warn: not remap,',uri);
        return uri;
    }
}else
{
    Images.server = {
        remapuri: function(uri){
            return uri;
        }
    }
}