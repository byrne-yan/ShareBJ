Images = {};

Images.HighQualityMaxSize = 4 * 1024 * 1024; //4M
Images.NormalQualityMaxSize = 2 * 1024 * 1024; //4M
Images.ThumbMaxSize = 128 * 1024; //128K
Images.ThumbExpires =  60 * 60; //one hour expires

Images.HighQualityWidth = 1600;
Images.HighQualityHeight = 1600;
Images.NormalQualityHeight = 600;
Images.NormalQualityWidth = 600;
//Images.ThumbWidth = 80;
//Images.ThumbHeight = 80;
Images.ThumbWidth = 143;
Images.ThumbHeight = 143;


Slingshot.fileRestrictions("imageUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: Images.HighQualityMaxSize
});

Slingshot.fileRestrictions("thumbUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: Images.ThumbMaxSize
});

UploadStat = new Mongo.Collection("upload_stat");