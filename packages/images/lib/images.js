Images = {};

Images.HighQualityMaxSize = 4 * 1024 * 1024; //4M
Images.NormalQualityMaxSize = 2 * 1024 * 1024; //4M
Images.ThumbMaxSize = 128 * 1024; //128K
Images.ThumbExpires =  60 * 60; //one hour expires

Images.HighQualityWidth = 1600;
Images.HighQualityHeight = 1600;
Images.NormalQualityHeight = 800;
Images.NormalQualityWidth = 800;
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
    find:(selector,options)=>{
        if(!selector) selector={};
        _.extend(selector,{_type:'upload',progress:{$gte: 0}});
        return LocalCollection.find(selector,options);
    },
    findOne:(selector,options)=>{
        if(!selector) selector={};
        _.extend(selector,{_type:'upload',progress:{$gte: 0}});
        return LocalCollection.findOne(selector,options);
    },
    insert:(doc,callback)=>{
        if(doc) _.extend(doc,{_type:'upload'});

        return LocalCollection.insert(doc,callback);
    },
    update:(selector,modifier,options,callback)=>{
        if(!selector) selector={};
        _.extend(selector,{_type:'upload'});
        return LocalCollection.update(selector,modifier,options,callback);
    },
    remove:(selector,callback)=>{
        if(!selector) selector={};
        _.extend(selector,{_type:'upload',progress:{$gte: 0}});
        return LocalCollection.remove(selector,callback);
    }
};
