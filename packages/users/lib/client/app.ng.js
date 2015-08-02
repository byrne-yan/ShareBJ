angular.module('shareBJ.users',['shareBJ.lib'])
    .run(function($ionicPopup){
        if(!ShareBJ.users)
            ShareBJ.users = {};
        if(!ShareBJ.users.client)
            ShareBJ.users.client={};

        ShareBJ.users.client.modal = $ionicPopup;
    })
;

