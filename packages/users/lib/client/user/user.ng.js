angular.module('shareBJ.users')
    .controller('UserCtrl',function($rootScope,$scope,$ionicHistory,$ionicModal,$meteor,$timeout, $ionicLoading){
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
                $scope.memo = $rootScope.currentUser.profile.memo;
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
        $ionicModal.fromTemplateUrl('sbj_users_lib/client/user/avatar_edit.ng.html',{
            scope:$scope,
            animation:'slide-in-up',
            focusFirstInput:true
        }).then(function(modal){
            $scope.modals.avatar = modal;
        });
        $ionicModal.fromTemplateUrl('sbj_users_lib/client/user/memo_edit.ng.html',{
            scope:$scope,
            animation:'slide-in-up',
            focusFirstInput:true
        }).then(function(modal){
            $scope.modals.memo = modal;
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
        $scope.saveMemo = function(edit){
            $meteor.call('updateCurrentUserMemo',$rootScope.currentUser._id,edit.memo)
                .then(function(data){
                    console.log('Updating memo success!');
                },
                function(error){
                    console.log(error);
                });

            $scope.memo = edit.memo;

            $scope.modals.memo.hide();
            edit.memo = "";
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

        //Avatar

        $scope.saveAvatar = function(){
            var canvas = $scope.$image.cropper('getCroppedCanvas',{
                width:64,
                height:64
            });

            var avatarUploader = new Slingshot.Upload('avatarUploads',{userId:$rootScope.currentUser._id});
            canvas.toBlob(function(blob){
                avatarUploader.send(blob,function(error,downloadUrl){
                    if(error)
                    {
                        console.log('Error uploading avatar',avatarUploader.xhr.response);

                    }else{
                        $ionicLoading.show({
                            template: "上传中..."
                        });
                        if(avatarUploader.progress() === 1)
                        {
                            console.log("Uploading progress:" + avatarUploader.progress());
                            $meteor.call('updateCurrentUserAvatar',$rootScope.currentUser._id,downloadUrl);
                            $ionicLoading.hide();
                            $scope.avatar = downloadUrl;
                            $scope.modals.avatar.hide();
                            $scope.$image.cropper('destroy');
                        }
                    }
                });

            }, "image/jpeg", 0.8);
        };
        $scope.fileSelected =function(input){
            var reader = new FileReader();
            reader.onloadend =function(){
                $scope.$apply(function(){
                    $scope.edit.fileAsUrl = reader.result;
                });
            };

            if(input.files && input.files[0])
            {
                 reader.readAsDataURL(input.files[0]);
            }
        };
        $scope.imgChanged = function(){
            if($scope.$image){
                $scope.$image.cropper('destroy');
            }
            $scope.$image = $('#cropper-container > img');
            $scope.cropBoxData = null;
            $scope.cropCanvasData = null;

            var fnSaveCrop = function(){
                $scope.$apply(function(){
                    //$scope.$image.cropper('setCropBoxData',$scope.cropBoxData);
                    $scope.croppedCanvas = $scope.$image.cropper('getCroppedCanvas').toDataURL();
                });
            };

            $scope.$image.cropper({
                autoCropArea: 0.5,
                rounded:true,
                //preview:'#previewImage',
                built: fnSaveCrop,
                dragmove:fnSaveCrop,
                dragend: fnSaveCrop,
                zoomin:fnSaveCrop,
                zoomout:fnSaveCrop,
                change:fnSaveCrop
            });
        };


        //Memo
        $scope.fnEdit = function(field){
            switch(field){
                case 'memo':
                    $scope.edit = {memo:$rootScope.currentUser.profile.memo};
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
                    $scope.edit = {};
                    break;
            }

            $scope.modals[field].show();
        };
        $scope.closeEditor =  function(modal){
            $scope.modals[modal].hide();
            if(modal==='avatar'){
                $scope.$image.cropper('destroy');
            }
        };

    })
;