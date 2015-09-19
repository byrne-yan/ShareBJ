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
                }, function(error) {
                    console.log("getPictures error:",error);
                    $scope.sbjError.sharebj = true;
                    $scope.sbjError.sharebjErrorMessage = error.message();
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
            templateUrl: "sbj_lib_client/directive/avatar_directive.ng.html",
            controller:function($scope,$rootScope,$meteor,$ionicLoading,$ionicActionSheet,$cordovaCamera,$timeout,$ionicModal){
                $scope.sbjError = {
                    sharebj:false,
                    sharebjErrorMessage:''
                };



                $scope.$on('modal.shown', function(){
                    $scope.edit = {};
                    $scope.croppedCanvas = null;

                    $scope.imagesFacade = document.getElementById("imageFacade");
                    $scope.imagesPicker = document.getElementById("imagePicker");

                    $scope.cropperImage = $('#cropper-origin-img');
                    $scope.cropperImage.cropper({
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

                                $timeout(function(){
                                    $scope.$apply(function(){
                                        var croppedCanvas = $scope.cropperImage.cropper('getCroppedCanvas');
                                        $scope.croppedCanvas = croppedCanvas.width?croppedCanvas.toDataURL():null;
                                    });
                                })
                            }
                        }
                    });
                });
                $scope.$on('modal.hide',function(){
                    if($scope.$image)
                        $scope.$image.cropper('destroy');
                    $scope.edit = {};
                    $scope.croppedCanvas = null;
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
                        processImage(input.files[0],Images.NormalQualityWidth,Images.NormalQualityHeight,1,function(dataURL){
                            console.log(dataURL);
                            $scope.$apply(function(){
                                $scope.edit.fileAsUrl = dataURL;
                            });
                        })
                    }
                };


                $scope.$meteorAutorun(function(){
                    var newUrl = $scope.getReactively('edit.fileAsUrl');
                    //console.log('replace url '+newUrl);
                    if($scope.cropperImage)
                        $scope.cropperImage.cropper('replace',newUrl);
                });

                $scope.saveAvatar = function(){
                    if($scope.savingMessage)
                        $ionicLoading.show({template:$scope.savingMessage});

                    var canvas = $scope.cropperImage.cropper('getCroppedCanvas',{
                        width:40,
                        height:40
                    });

                    canvas.toBlob(function(blob) {
                        $scope.save()(blob,canvas.toDataURL("image/jpeg", 0.8),function(error){
                            if($scope.savingMessage) $ionicLoading.hide();
                            if(error)
                            {
                                $scope.sbjError.sharebj = true;
                                $scope.sbjError.sharebjErrorMessage = error.message();
                            }else{
                                $scope.close();
                            }
                        });
                    },"image/jpeg", 0.8);
                };

                $scope.close =  function(){
                    if($scope.$image)
                        $scope.$image.cropper('destroy');
                    $scope.edit = {};
                    $scope.croppedCanvas = null;
                    $scope.onclose();
                };
            }
        }

    };
    angular.module('shareBJ.lib')
        .directive("sbjAvatar",directive);
}());
