//Accounts.onLogin(function(){
//    Users.getUploadLimits(Meteor.userId(),function(limits){
//        Session.set('UploadLimits',limits);
//    })
//});
//
//Accounts.onLogout(function(){
//    Session.set('UploadLimits',undefined);
//});

Tracker.autorun(function(){

    if(Meteor.userId())
    {
        Users.getUploadLimits(Meteor.userId(),function(limits){
            Session.set('UploadLimits',limits);
        })

    }else{
        Session.set('UploadLimits',undefined);
    }
});