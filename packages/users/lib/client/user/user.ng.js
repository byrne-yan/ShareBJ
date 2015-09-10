angular.module('shareBJ.users')
    .controller('UserCtrl',function($rootScope,$scope,$ionicHistory,$ionicModal,$meteor,$timeout, $ionicLoading){
        if($rootScope.currentUser)
        {
            Tracker.autorun(function(){
                $scope.mobile = $rootScope.currentUser.phone ?
                    $rootScope.currentUser.phone : {number: "", verified: false};

                //$scope.avatar =  "images/hold32X32.png";
                $scope.name = $rootScope.currentUser.username;
                if ($rootScope.currentUser.profile) {
                    $scope.avatar = $rootScope.currentUser.profile.avatar;
                    $scope.name = $rootScope.currentUser.profile.name;
                    if ($rootScope.currentUser.birth) {
                        $scope.gender = $rootScope.currentUser.profile.gender;
                        $scope.birthday = $rootScope.currentUser.profile.birthday;
                    }
                    $scope.motto = $rootScope.currentUser.profile.motto;
                }
                $scope.username= $rootScope.currentUser.username;
                $scope.email = $rootScope.currentUser.emails?$rootScope.currentUser.emails[0]:{address:'',verified:true};
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
        $scope.modals.avatar = $ionicModal.fromTemplate(
            '<sbj-avatar save="saveAvatar" saving-message="正在上传头像..." onclose="closeAvatarEditor()"></sbj-avatar>',{
            scope:$scope,
            animation:'slide-in-up'
        });
        $ionicModal.fromTemplateUrl('sbj_users_lib/client/user/motto_edit.ng.html',{
            scope:$scope,
            animation:'slide-in-up',
            focusFirstInput:true
        }).then(function(modal){
            $scope.modals.motto = modal;
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
            $scope.closeEditor('email');
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
            $scope.closeEditor('mobile');
            edit.mobile = "";
        };
        $scope.saveMotto = function(edit){
            $meteor.call('updateCurrentUserMotto',$rootScope.currentUser._id,edit.motto)
                .then(function(data){
                    console.log('Updating motto success!');
                },
                function(error){
                    console.log(error);
                });

            $scope.motto = edit.motto;

            $scope.modals.motto.hide();
            edit.motto = "";
        };

        //SMS verification
        $scope.sms_sending = false;
        $scope.sms_blocked = false;
        $scope.sendCode = function () {
            $meteor.call('sendVerifySMS',$scope.edit.mobile)
                .then(function(messageId){
                    $scope.sms_blocked = true;
                },function(error){
                    console.log(error);
                });
        };

        //Email verification
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
        };

        //motto
        $scope.fnEdit = function(field){
            switch(field){
                case 'motto':
                    $scope.edit = {motto:$rootScope.currentUser.profile.motto};
                    break;
                case 'name':
                    $scope.edit = {name:$scope.name};
                    break;
                case 'email':
                    $scope.edit = {email:$scope.email.address};
                    break;
                case 'mobile':
                    $scope.edit = {mobile:$scope.mobile.number};
                    break;
                case 'avatar':
                    $scope.croppedCanvas = $scope.avatar;
                    break;
            }

            $scope.modals[field].show();
        };

        //avatar
        $scope.closeAvatarEditor = function(){
            $scope.modals.avatar.hide();
        };
        $scope.saveAvatar = function(blob,dataURL,callback){
            var avatarUploader = new Slingshot.Upload('avatarUploads',{userId:$rootScope.currentUser._id});
            avatarUploader.send(blob,function(error,downloadUrl){
                if(error)
                {
                    //$ionicLoading.hide();
                    callback(error);
                }else{
                    console.log("Uploading progress:" + avatarUploader.progress());
                    $meteor.call('updateCurrentUserAvatar',$rootScope.currentUser._id,downloadUrl)
                        .then(function(){
                            $timeout(function(){
                                $scope.$apply(function(){
                                    $scope.avatar = downloadUrl;
                                });
                            },0);

                            callback();
                            $scope.closeAvatarEditor();
                        },function(err){
                            callback(error);
                        });
                }
            });
        };

        $scope.closeEditor =  function(modal){
            $scope.modals[modal].hide();
        };

    })
;