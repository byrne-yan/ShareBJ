angular.module('shareBJ.users')
    .controller('UserAvatarCtrl',function($scope,$rootScope,$meteor,$ionicLoading,$ionicActionSheet,$cordovaCamera,$timeout,$ionicModal){
        //Avatar

        $scope.sbjError = {
            sharebj:false,
            sharebjErrorMessage:''
        };


        function connect(){
            $scope.imagesFacade = document.getElementById("imageFacade");
            $scope.imagesPicker = document.getElementById("imagePicker");
        };
        $scope.$on('modal.shown',connect);

        $scope.edit = {};
        $scope.pick = function(){
            if(!Meteor.isCordova)
            {
                $scope.imagesPicker.click();
            }else{
                ShareBJ.pictureSource($ionicActionSheet)
                    .then(function(source){
                        switch (source){
                            case 0:　//camera
                            case 1:
                                //using $cordovaCamera
                                var options = {
                                    destinationType: Camera.DestinationType.DATA_URL,
                                    targetWidth: 480,
                                    targetWidth: 480,
                                    sourceType:source?Camera.PictureSourceType.PHOTOLIBRARY:Camera.PictureSourceType.CAMERA
                                };
                                $cordovaCamera.getPicture(options)
                                    .then(function(imageData){
                                        $scope.edit.fileAsUrl = "data:image/jpeg;base64," + imageData;
                                    }, function(error) {
                                        console.log("getPictures error:",error);
                                        $scope.sbjError.sharebj = true;
                                        $scope.sbjError.sharebjErrorMessage = error.message();
                                    });
                                break;
                        }
                    })
            }
        };

        $scope.fileSelected =function(input){
            var reader = new FileReader();
            reader.onloadend =function(){
                $scope.$apply(function(){
                    //console.log("edit.fileAsUrl updated");
                    //console.log(reader.result);
                    $scope.edit.fileAsUrl = reader.result;
                });
            };

            if(input.files && input.files[0])
            {
                reader.readAsDataURL(input.files[0]);
            }
        };

        $scope.imgChanged = function(){
            //console.log("imgChanged called");
            if($scope.$image){
                $scope.$image.cropper('reset');
            }

            $scope.$image = $('#cropper-container > img');

            $scope.cropCanvasData = null;
            var fnSaveCrop = function(){
                $scope.$apply(function(){
                    //console.log("croppedCanvas updated");
                    $scope.croppedCanvas = $scope.$image.cropper('getCroppedCanvas').toDataURL();
                });
            };

            $scope.$image.cropper({
                autoCropArea: 0.5,
                rounded:true,
                //cropstart:fnSaveCrop,
                //cropmove:fnSaveCrop,
                //cropend: fnSaveCrop,
                //zoom:fnSaveCrop,
                crop:fnSaveCrop
            });
        };

        $scope.rotate = function(){
            $timeout(function(){
                $scope.$image.cropper("rotate",90);
            },0);
        };

        $scope.saveAvatar = function(){
            $ionicLoading.show({template:"正在上传头像..."});

            var canvas = $scope.$image.cropper('getCroppedCanvas',{
                width:64,
                height:64
            });

            var avatarUploader = new Slingshot.Upload('avatarUploads',{userId:$rootScope.currentUser._id});
            canvas.toBlob(function(blob){
                avatarUploader.send(blob,function(error,downloadUrl){
                    if(error)
                    {
                        //console.log('Error uploading avatar',avatarUploader.xhr.response);
                        $ionicLoading.hide();
                        $scope.sbjError.sharebj = true;
                        $scope.sbjError.sharebjErrorMessage = error.message();

                    }else{
                        console.log("Uploading progress:" + avatarUploader.progress());
                        $meteor.call('updateCurrentUserAvatar',$rootScope.currentUser._id,downloadUrl)
                            .then(function(){
                                $timeout(function(){
                                    $scope.$apply(function(){
                                        $scope.avatar = downloadUrl;
                                    });
                                },0);

                                $ionicLoading.hide();
                                $scope.modals.avatar.hide();
                                $scope.$image.cropper('destroy');
                            },function(err){
                                console.log(err);
                                $ionicLoading.hide();
                                $scope.sbjError.sharebj = true;
                                $scope.sbjError.sharebjErrorMessage = err.message();

                            });
                    }
                });

            }, "image/jpeg", 0.8);
        };

        $scope.close =  function(){
            if($scope.$image)
                $scope.$image.cropper('destroy');
            $scope.modals.avatar.hide();

        };
    });
