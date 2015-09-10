(function(){
    var directive = function(){
        function takePhoto(source,$scope){
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
        };

        return {
            restrict: 'E',
            scope:{
                savingMessage:'@',
                onclose:'&',
                save: '&'
            },
            replace:"true",
            templateUrl: "sbj_lib_client/avatar_directive.ng.html",
            controller:function($scope,$rootScope,$meteor,$ionicLoading,$ionicActionSheet,$cordovaCamera,$timeout,$ionicModal){
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
                                        takePhoto(source,$scope);
                                        break;
                                }
                            })
                    }
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
                    if($scope.savingMessage)
                        $ionicLoading.show({template:$scope.savingMessage});

                    var canvas = $scope.$image.cropper('getCroppedCanvas',{
                        width:64,
                        height:64
                    });

                    canvas.toBlob(function(blob) {
                        $scope.save()(blob,canvas.toDataURL("image/jpeg", 0.8),function(error){
                            if($scope.savingMessage) $ionicLoading.hide();
                            if(error)
                            {
                                $scope.sbjError.sharebj = true;
                                $scope.sbjError.sharebjErrorMessage = error.message();
                            }else{
                                $scope.$image.cropper('destroy');
                                $scope.onclose();
                            }
                        });
                    },"image/jpeg", 0.8);
                };

                $scope.close =  function(){
                    if($scope.$image)
                        $scope.$image.cropper('destroy');
                    $scope.onclose();
                };
            }
        }

    };
    angular.module('shareBJ.lib')
        .directive("sbjAvatar",directive);
}());
