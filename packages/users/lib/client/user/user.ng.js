angular.module('shareBJ.users')
    .controller('UserCtrl',function($rootScope,$scope,$ionicHistory,$ionicModal,$meteor,$timeout){
        if($rootScope.currentUser)
        {
            Tracker.autorun(function(){
                $scope.mobile= $rootScope.currentUser.profile.mobiles?
                    $rootScope.currentUser.profile.mobiles[0]:{number:"",verified:false};
                $scope.avatar = $rootScope.currentUser.profile.avatar || "images/hold32X32.png";
                $scope.username= $rootScope.currentUser.username;
                $scope.name = $rootScope.currentUser.profile.name;
                $scope.email = $rootScope.currentUser.emails?$rootScope.currentUser.emails[0]:{address:'',verified:true};
                $scope.gender = $rootScope.currentUser.profile.gender ;
                $scope.birthday = $rootScope.currentUser.profile.birthday;
            });
        };
        $scope.goBack = function(){
            $ionicHistory.goBack();
        }
        $scope.modals = {};
        $ionicModal.fromTemplateUrl('sbj_users_lib/client/user/name_edit.ng.html',{
            scope:$scope,
            animation:'slide-in-up',
            focusFirstInput:true
        }).then(function(modal){
            $scope.modals.name = modal;
        });
        $ionicModal.fromTemplateUrl('sbj_users_lib/client/user/email_edit.ng.html',{
            scope:$scope,
            animation:'slide-in-up',
            focusFirstInput:true
        }).then(function(modal){
            $scope.modals.email = modal;
        });
        $ionicModal.fromTemplateUrl('sbj_users_lib/client/user/mobile_edit.ng.html',{
            scope:$scope,
            animation:'slide-in-up',
            focusFirstInput:true
        }).then(function(modal){
            $scope.modals.mobile = modal;
        });

        $scope.saveName = function(edit){
            $meteor.call('updateCurrentUserName',$rootScope.currentUser._id,edit.name)
                .then(function(data){
                    console.log('Updating name success!');
            },
            function(error){
                console.log(error);
            });

            $scope.name = edit.name;
            $scope.modals.name.hide();
            edit.name = "";
        };
        $scope.saveEmail = function(edit){
            $meteor.call('updateCurrentUserEmail',$rootScope.currentUser._id,edit.email)
                .then(function(data){
                    console.log('Updating email success!');
                },
                function(error){
                    console.log(error);
                });

            $scope.email = {address:edit.email,verified:false};
            $scope.closeEmailEditor();
            edit.email = "";
        };
        $scope.saveMobile = function(edit){
            $meteor.call('updateCurrentUserMobile',$rootScope.currentUser._id,edit.mobile)
                .then(function(data){
                    console.log('Updating mobile success!');
                },
                function(error){
                    console.log(error);
                });

            $scope.mobile = {number:edit.mobile,verified:false};
            $scope.closeMobileEditor();
            edit.mobile = "";
        };
        $scope.editName = function(){
            $scope.edit = {name:$scope.name};
            $scope.modals.name.show();
        };
        $scope.closeNameEditor =  function(){
            $scope.modals.name.hide();
        };
        $scope.editEmail = function(){
            $scope.edit = {email:$scope.email.address};
            $scope.modals.email.show();
        };
        $scope.closeEmailEditor =  function(){
            $scope.modals.email.hide();
        };
        $scope.editMobile = function(){
            $scope.edit = {mobile:$scope.mobile.number};
            $scope.modals.mobile.show();
        };
        $scope.closeMobileEditor =  function(){
            $scope.modals.mobile.hide();
        };

        $scope.sending = false;
        $scope.blocked = false;
        $scope.sendVerifyEmail = function () {
            $scope.sending = true;
            $scope.blocked = true;
            $timeout(function(){
                $scope.blocked = false;
            },30*1000);

            $meteor.call('sendVerificationEmail',$rootScope.currentUser._id)
                .then(function(){
                    console.log('验证邮件已发送！');
                    $scope.sending = false;
                },
                function(error)
                {
                    console.log(error);
                    $scope.sending = false;
                }
            );
        }
    })
;