(function(){
    var directive = function(){
        function takePhoto(source,$scope,$cordovaCamera){
            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                targetWidth: 800,
                targetWidth: 800,
                sourceType:source?Camera.PictureSourceType.PHOTOLIBRARY:Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options)
                .then(function(imageData){
                    $scope.edit.fileAsUrl = "data:image/jpeg;base64," + imageData;
                    //if($scope.cropperImage)
                        $scope.cropperImage.cropper('replace',$scope.edit.fileAsUrl);
                }, function(error) {
                    console.log("getPictures error:",error);
                    $scope.sbjError.sharebj = true;
                    $scope.sbjError.sharebjErrorMessage = error.message;
                });
        };

        return {
            restrict: 'E',
            scope:{
                savingMessage:'@',
                onclose:'&',
                save: '&'
            },
            replace:"true",
            templateUrl: "sbj_avatar_lib/client/directive/avatar_directive.ng.html",
            controller:function($scope,$rootScope,$meteor,$ionicLoading,$ionicActionSheet,$cordovaCamera,$timeout,$ionicModal){
                $scope.sbjError = {
                    sharebj:false,
                    sharebjErrorMessage:''
                };

                $scope.$on('modal.shown', function(){
                    $scope.edit = {};

                    $scope.imagesFacade = document.getElementById("imageFacade");
                    $scope.imagesPicker = document.getElementById("imagePicker");

                    $scope.cropperImage = $('#cropper-origin-img');
                    console.log("$scope.cropperImage",$scope.cropperImage);
                    $scope.cropperImage.cropper({
                        //preview:"#avatarCandidate",
                        aspectRatio: 1 / 1,
                        autoCropArea: 0.5,
                        rounded:true,
                        strict:true,
                        minCanvasWidth:32,
                        minCanvasHeight:32,
                        minCropBoxWidth:32,
                        minCropBoxHeight:32,
                        crop:function(){
                            if($scope.cropperImage ){
                                //console.log("crop");
                                $timeout(function(){
                                    $scope.$apply(function(){
                                        var croppedCanvas = $scope.cropperImage.cropper('getCroppedCanvas');
                                        $scope.edit.croppedCanvas = croppedCanvas.width?croppedCanvas.toDataURL():null;
                                    });
                                })
                            }
                        }
                    });
                });
                $scope.$on('modal.removed',function(){
                    if($scope.cropperImage)
                        $scope.cropperImage.cropper('destroy');
                    $scope.edit = {};
                });

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
                                        takePhoto(source,$scope,$cordovaCamera);
                                        break;
                                }
                            })
                    }
                };

                $scope.fileSelected =function(input){
                    //console.log(input);
                    if(input.files && input.files[0])
                    {
                        console.log(input.files[0]);
                        processImage(input.files[0],{maxWidth:Images.NormalQualityWidth,maxHeight:Images.NormalQualityHeight,quality:1},function(dataURL){
                            console.log(dataURL);
                            console.log('$scope.cropperImage.cropperreplace');
                                        $scope.cropperImage.cropper('replace',dataURL);
                        })
                    }
                };
                $scope.$watch('edit.croppedCanvas',
                    function(newValue,oldValue,scope){
                        //console.log("$scope.edit.croppedCanvas:",newValue,oldValue);
                        //console.log(scope);
                        if(scope.edit)
                            scope.edit.hasCroppedCanvas = !!newValue;
                },true);

                //$scope.$watch('edit.fileAsUrl',function(newValue,oldValue,scope){
                //   console.log("$scope.edit.fileAsUrl:",newValue,oldValue,scope.edit);
                //    if(scope.edit)
                //        scope.edit.hasImage = !!newValue;
                //},true);
                //$scope.$meteorAutorun(function(){
                //    var newUrl = $scope.getReactively('edit.fileAsUrl');
                //    console.log('replace url '+newUrl);
                //    //if($scope.cropperImage)
                //    //    $scope.cropperImage.cropper('replace',newUrl);
                //    $timeout(function(){
                //        $scope.$apply(function(){
                //            $scope.hasImage = !!$scope.edit && !!$scope.edit.fileAsUrl;
                //        })
                //    });
                //});

                $scope.saveAvatar = function(){
                    if($scope.savingMessage)
                        $ionicLoading.show({template:$scope.savingMessage});

                    var canvas = $scope.cropperImage.cropper('getCroppedCanvas',{
                        width:40,
                        height:40
                    });

                    $scope.save()(canvas.toDataURL("image/jpeg", 1))
                        .then((avatarId)=>{
                            if ($scope.savingMessage) $ionicLoading.hide();
                            $scope.close();
                        })
                        .catch((error)=>{
                            if ($scope.savingMessage) $ionicLoading.hide();
                            $scope.sbjError.sharebj = true;
                            $scope.sbjError.sharebjErrorMessage = error.message;
                            });

                };

                $scope.close =  function(){
                    if($scope.$image)
                        $scope.$image.cropper('destroy');
                    $scope.edit = {};
                    $scope.onclose();
                };
            }
        }

    };
    angular.module('shareBJ.avatar')
        .directive("sbjAvatar",directive);
}());
