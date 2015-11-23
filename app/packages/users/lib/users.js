Users = Meteor.users;



Users.getEmail =function(user){
    return Meteor.users.findOne(user).emails[0].address;
};

//Meteor.users._transform = function(user){
//    //const ip = this.connection.clientAddress=='127.0.0.1'?ShareBJ.getPublicIp4Dev():this.connection.clientAddress;
//    if (user.profile && user.profile.avatar) {
//        if (Meteor.isServer) {
//            user.profile.avatar = Images.getPresignedUrl(user.profile.avatar, ShareBJ.getPublicIp4Dev());
//        } else {
//            Meteor.apply('images/signingAvatar', [user.profile.avatar],{onResultReceived:function(result){
//                user = result;
//            }})
//        }
//    }
//    console.log("Meteor.users._transform",user);
//
//    return user;
//};

