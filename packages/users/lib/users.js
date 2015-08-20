Users = Meteor.users;

Slingshot.fileRestrictions("avatarUploads",{
   allowedFileTypes:["image/png","image/jpeg","image/gif"],
    maxSize: 128 * 1024 //128K
});

Users.getEmail =function(user){
    return Meteor.users.findOne(user).emails[0].address;
};

