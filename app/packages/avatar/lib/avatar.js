Avatars = new Mongo.Collection('avatars');

Slingshot.fileRestrictions("avatarUploads",{
    allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: 128 * 1024 //128K
});