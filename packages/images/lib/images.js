Images = {};

Images.HighQualityMaxSize = 4 * 1024 * 1024; //4M
Images.NormalQualityMaxSize = 2 * 1024 * 1024; //4M
Images.ThumbMaxSize = 128 * 1024; //128K
Images.ThumbExpires =  60 * 60; //one hour expires


Images.Quality4KWidth = 3840; //3840x2160 4K
Images.Quality4KHeight = 3840;
Images.Quality2KWidth = 2560; //2560x1440 2K 1440p
Images.Quality2KHeight = 2560;
Images.Quality1080Width = 1920; //1920*1080 1080p
Images.Quality1080Height = 1920;
Images.Quality720Height = 1280; // 1280*720 720p
Images.Quality720Width = 1280;


Images.HighQualityWidth = Images.Quality4KWidth;
Images.HighQualityHeight = Images.Quality4KHeight;
Images.NormalQualityHeight = Images.Quality720Height;
Images.NormalQualityWidth = Images.Quality720Width;


//Images.ThumbWidth = 80;
//Images.ThumbHeight = 80;
Images.ThumbWidth = 143;
Images.ThumbHeight = 143;



Slingshot.fileRestrictions("imageUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: Images.NormalQualityMaxSize
});

Slingshot.fileRestrictions("thumbUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: Images.ThumbMaxSize
});

Slingshot.fileRestrictions("originUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: Images.HighQualityMaxSize
});

Uploads = {
    _uploaders:{},
    isUploading:function(){
        return !!LocalCollection.findOne({_type:'upload', end: {$exists:false}});
    },
    find:function(selector,options){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload',progress:{$gte: 0}});
        return LocalCollection.find(selector,options);
    },
    findOne:function(selector,options){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload',progress:{$gte: 0}});
        return LocalCollection.findOne(selector,options);
    },
    insert:function(doc,callback){
        if(doc) _.extend(doc,{_type:'upload'});

        return LocalCollection.insert(doc,callback);
    },
    update:function(selector,modifier,options,callback){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload'});
        return LocalCollection.update(selector,modifier,options,callback);
    },
    remove:function(selector,callback){
        if(!selector) selector={};
        _.extend(selector,{_type:'upload',progress:{$gte: 0}});
        return LocalCollection.remove(selector,callback);
    }
};
