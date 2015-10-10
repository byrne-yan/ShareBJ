angular.module('ShareBJ', ['shareBJ.users', 'shareBJ.babies', 'shareBJ.journals','shareBJ.images'])
    .controller('AppCtrl',function($scope,$state,$meteor,$ionicHistory,$rootScope,$timeout) {
        //$scope.popover = $ionicPopover.fromTemplate( '<ion-popover-view>' +
        //    '<ion-content><div class="list">' +
        //        '<div class="item item-button-left">' +
        //        '<button class="button button-clear" ui-sref="shareBJ.babies.requests">' +
        //        '   <i class="icon ion-email-unread assertive"></i>' +
        //        '</button>' +
        //        '</div>' +
        //    '</list></ion-content>' +
        //'</ion-popover-view>'
        //,{scope:$scope});

        //$scope.subs = [];
        $scope.$meteorAutorun(function () {
            //console.log("Autorun");
            if (Meteor.userId()) {
                //console.log("Autorun with userId");
                $scope.notifications = $scope.$meteorCollection(function () {
                    return Herald.getNotifications({medium: 'onsite'});
                });
                $scope.notificationCount = $scope.notifications.length;

                $scope.$meteorSubscribe('myRequests')
                    .then(function (subId) {
                        //console.log("myRequests id:",subId);
                        //$scope.subs.push(subId);
                        $scope.requestsCount = $scope.$meteorObject(Counts, 'numOfMyRequests', false);

                    }, console.log);
            }
        });
        Tracker.autorun(function(){
            if($rootScope.getReactively('currentUser'))
            {
                if($rootScope.currentUser.profile){
                    console.log("set profile session",$rootScope.currentUser.profile);
                    Session.set('profile',$rootScope.currentUser.profile);
                }
                $timeout(function(){});
            }
        });
        Tracker.autorun(function(){
            //console.log('respond to profile change:',Session.get('profile'));
            if(Session.get('profile'))
            {
                $scope.avatar = Session.get('profile').avatar;
                $scope.name = Session.get('profile').name || $rootScope.currentUser.username;
                $scope.motto = Session.get('profile').motto;

                $timeout(function(){});
            }
        });

        $scope.menuBabies = ShareBJ.menu.babiesList;
        $scope.menuUserSummary = ShareBJ.menu.userSummary;
        $scope.menuUploading = ShareBJ.menu.uploadDashboard;
        $scope.logout = function(){
            $meteor.logout().then(
                function(){
                    //console.log("UserId after logout:",Meteor.userId());
                    //_.each($scope.subs,function(sub){
                    //    sub.stop();
                    //});
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go(ShareBJ.state.login);
                },
                console.log
            )
        }
    })
    .run(function($ionicPlatform,$ionicPopup,$ionicHistory){
         $ionicPlatform.registerBackButtonAction(function(event){
             if(!$ionicHistory.backView())//check prevent condition
             {
                 var moreInfo = '';
                 if(Uploads.isUploading())
                    moreInfo = '还有照片正在上传，此时退出可能会导致上传失败。';

                 $ionicPopup.confirm({
                     title:'退出应用确认',
                     template: moreInfo + "你要确定要退出ShareBJ吗？"
                 })
                 .then(function(res){
                     if(res){//yes
                        ionic.Platform.exitApp();
                     }
                 });
             }else{
                 $ionicHistory.goBack();
             }
         }, 100);
    })
;



// to get meteor app on cordova with angular integration
Meteor.startup(function(){
    function onReady() {
        angular.bootstrap(document, ['ShareBJ']);
        //if(Meteor.isCordova){
        //    window.plugins.sim.getSimInfo(function(info){
        //        ShareBJ.phoneInfo = info;
        //        console.log(info);
        //    },function(err){
        //        console.log(err);
        //    });
        //    ShareBJ.contacts =  navigator.contacts;
        //    console.log(ShareBJ.contacts);
        //    ShareBJ.contacts.find([
        //        "name",
        //        "displayname",
        //        "nickname"
        //    ],function(contacts){
        //        console.log(contacts);
        //    },function(err){
        //        console.log(err);
        //    },{filter:"本机号码",multiple:true});
        //    console.log(device);
        //}
    }

    if (Meteor.isCordova)
        angular.element(document).on("deviceready", onReady);
    else
        angular.element(document).ready(onReady);
});


