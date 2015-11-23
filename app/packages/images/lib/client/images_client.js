if(Meteor.isCordova){
    Images.server = {
        url:'',
        local_path:'',//cordova.file.applicationStorageDirectory
        cache_url:'/cache/',
        local_path_cache:'', //cordova.file.cacheDirectory
        data_url:'/files/',
        local_path_data:'', //cordova.file.dataDirectory

        ext_url:'/extdata/',
        local_ext_path:'', //cordova.file.externalApplicationStorageDirectory
        ext_cache_url:'/extdata/cache/',
        local_ext_path_cache:'', //cordova.file.externalCacheDirectory
        ext_data_url:'/extdata/files/',
        local_ext_path_data:'', //cordova.file.externalDataDirectory

        image_cache_url:'/images_cache/',
        image_cache_path:'',
        image_cache_ext_url:'/images_cache_ext/',
        image_cache_ext_path:''
    };
}
Images.getImageScaleFactor = function(){
    var limits = Session.get('UploadLimits');

    return {
        width:((limits && limits.quality==='high') ? Images.HighQualityWidth: Images.NormalQualityWidth),
        height:((limits && limits.quality==='high') ? Images.HighQualityHeight: Images.NormalQualityHeight),
        quality:((limits && limits.quality==='high') ? 100 : 75)
    }
};


UploadsCollection = new Ground.Collection('uploads',{connection:null});
Uploads = {
    _uploaders:{},

    isUploading:function(){
        return !!UploadsCollection.findOne({_type:'upload', end: {$exists:false}});
    },
    find:function(selector,options){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload'});
        return UploadsCollection.find(selector,options);
    },
    findOne:function(selector,options){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload'});
        return UploadsCollection.findOne(selector,options);
    },
    insert:function(doc,callback){
        if(doc) _.extend(doc,{_type:'upload'});

        return UploadsCollection.insert(doc,callback);
    },
    update:function(selector,modifier,options,callback){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload'});
        return UploadsCollection.update(selector,modifier,options,callback);
    },
    upsert:function(selector,modifier,options,callback){
        if(callback===undefined && _.isFunction(options))
        {
            callback = options;
            options = undefined;
        }
        if(!selector) selector={};
        _.extend(selector,{_type:'upload'});
        return UploadsCollection.upsert(selector,modifier,options,callback);
    },
    remove:function(selector,callback){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload'});
        return UploadsCollection.remove(selector,callback);
    }
};