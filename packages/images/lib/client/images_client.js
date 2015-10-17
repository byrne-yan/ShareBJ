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
        local_ext_path_data:'' //cordova.file.externalDataDirectory
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
