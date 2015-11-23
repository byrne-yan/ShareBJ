(function(){
    var directive = function(){
        function takePhoto(source,$scope,$cordovaCamera){
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                quality:100,
                targetWidth: 640,
                targetHeight: 640,
                saveToPhotoAlbum:false,
                correctOrientaton:true,
                allowEdit:false,
                sourceType:source?Camera.PictureSourceType.PHOTOLIBRARY:Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options)
                .then(function(uri){
                    var httpURI = Images.server.remapuri(uri);
                    console.log("uri and httpURI:",uri,httpURI);

                    $scope.cropperImage.cropper('replace',httpURI);
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
                        aspectRatio: 1,
                        autoCropArea: 0.8,
                        autoCrop:true,
                        strict: false,
                        checkImageOrigin:true,
                        minCanvasWidth:32,
                        minCanvasHeight:32,
                        minCropBoxWidth:32,
                        minCropBoxHeight:32,
                        build:function(){
                            $scope.cropperBuilt = false;
                        },
                        built:function(){
                            console.log('built');
                            $scope.cropperBuilt = true;
                            var croppedCanvas = $scope.cropperImage.cropper('getCroppedCanvas');
                            $scope.edit.croppedCanvas = croppedCanvas.width?croppedCanvas.toDataURL():null;
                            $timeout(function(){ });
                        },
                        cropend:function(){
                            if($scope.cropperImage && $scope.cropperBuilt){
                                console.log("cropend");
                                var croppedCanvas = $scope.cropperImage.cropper('getCroppedCanvas');
                                $scope.edit.croppedCanvas = croppedCanvas.width?croppedCanvas.toDataURL():null;
                                $timeout(function(){ });
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
                    if(input.files && input.files[0])
                    {
                        processImage(input.files[0],{maxWidth:Images.NormalQualityWidth,maxHeight:Images.NormalQualityHeight,quality:1},function(dataURL){
                            $timeout(function(){
                                $scope.cropperImage.cropper('replace',dataURL);
                            })
                        })
                    }
                };
                $scope.$watch('edit.croppedCanvas',
                    function(newValue,oldValue,scope){
                        if(scope.edit)
                            scope.edit.hasCroppedCanvas = !!newValue;
                },true);

                $scope.saveAvatar = function(){
                    if($scope.savingMessage)
                        $ionicLoading.show({template:$scope.savingMessage});

                    var canvas = $scope.cropperImage.cropper('getCroppedCanvas',{
                        width:40,
                        height:40
                    });

                    $scope.save()(canvas.toDataURL("image/jpeg", 1))
                        .then(function(avatarId){
                            if ($scope.savingMessage) $ionicLoading.hide();
                            $scope.close();
                        })
                        .catch(function(error){
                            if ($scope.savingMessage) $ionicLoading.hide();
                            $scope.sbjError.sharebj = true;
                            $scope.sbjError.sharebjErrorMessage = error.message;
                            });

                };
                $scope.rotate = function(){
                    if($scope.cropperImage)
                    {
                        $scope.cropperImage.cropper('rotate',90);
                        var croppedCanvas = $scope.cropperImage.cropper('getCroppedCanvas');
                        $scope.edit.croppedCanvas = croppedCanvas.width?croppedCanvas.toDataURL():null;
                    }
                };

                $scope.close = function(){
                    $scope.edit = {};
                    $scope.onclose();
                }
            }
        }

    };
    angular.module('shareBJ.avatar')
        .directive("sbjAvatar",directive);
}());
