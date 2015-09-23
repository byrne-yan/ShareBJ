(function(){
    var directive = function(){
        return {
            restrict: 'E',
            scope:{
                images:'=',
                thumb:'@',
                src:'@',
                exif:'@',
                start:'@',
                showTrash:'@',
                orientationFix:'@',
                onclose:'&'
            },
            replace:"true",
            templateUrl: "sbj_lib_client/directive/slidebox_directive.ng.html",
            controller:function($scope,$timeout,$ionicSlideBoxDelegate,$cordovaFile){
                //$cordovaFile.getFreeDiskSpace().then(function(size){
                //   console.log("free space:" + size/1024 + 'MB');
                //});
                //$cordovaFile.getFreeDiskSpace(false).then(function(size){
                //    console.log("free space:" + size/1024 + 'MB');
                //});
                //
                //chrome.system.memory.getInfo(function(info){
                //    console.log("memory:" + info.availableCapacity/1024/1024 +'/'+ info.capacity/1024/1024);
                //});

                $scope.slideImages = new Array($scope.images.length);
                for(var i=0;i<$scope.images.length;++i){
                    $scope.slideImages[i] = {//load thumb first
                        src:$scope.images[i][$scope.thumb],
                        thumb:true
                    };

                    var imgSrc = $scope.images[i][$scope.src];
                    if($scope.orientationFix){
                        //console.log("orientationFix");
                        function getImage(img,exif,idx){
                            //console.log('getImage with exif:',exif,img);
                            processImage(img,{maxWidth:Images.NormalQualityWidth,
                                maxHeight:Images.NormalQualityHeight,
                                quality:1,exif:exif}, function(data){
                                //console.log("got processed image:"+ Date.now());

                                $timeout(function() {
                                    $scope.$apply(function () {  //change to original picture
                                        //console.log("image applied:" + idx + ':' + Date.now());
                                        $scope.slideImages[idx] = {
                                            src: data,
                                            thumb: false
                                        };
                                        $ionicSlideBoxDelegate.update();
                                    })
                                },0);
                            })
                        };
                        getImage(imgSrc,$scope.images[i][$scope.exif],i);
                    }else{
                        debugger;
                        $scope.slideImages[i] = {
                            src:imgSrc,
                            thumb:false
                        };
                    }
                    //$scope.slideImages[i] = {src:imgSrc,thumb:false};
                };

                if($scope.start)
                {
                    //console.log("start slide #"+$scope.start);
                    if($scope.start < $ionicSlideBoxDelegate.slidesCount())
                    {
                        $ionicSlideBoxDelegate.slide($scope.start);
                    }else{
                        $timeout(function() {
                            $ionicSlideBoxDelegate.slide($scope.start);
                        },100);
                    }
                }

                $scope.closeModal = function(){
                    $scope.onclose();
                };

                $scope.slideHasChanged = function($index){
                    //console.log($index);
                };
                $scope.deleteImage = function(e){
                    console.log("try to delete image #" + $ionicSlideBoxDelegate.currentIndex());
                    var count = $ionicSlideBoxDelegate.slidesCount();
                    var idx = $ionicSlideBoxDelegate.currentIndex();
                    if(idx>0 && idx===count-1)//last one slide delete
                    {
                        $ionicSlideBoxDelegate.previous()//slide to previous
                    }
                    $ionicSlideBoxDelegate.enableSlide(false);
                    $scope.images.splice(idx,1);
                    $scope.slideImages.splice(idx,1);
                    if($scope.slideImages.length<=0)//no slide left
                        $scope.closeModal();
                    else{
                        $ionicSlideBoxDelegate.update();
                        if(idx===count-1)//last one slide delete
                            $ionicSlideBoxDelegate.slide(idx-1);
                        else
                            $ionicSlideBoxDelegate.slide(idx);
                        $ionicSlideBoxDelegate.enableSlide(true);
                    }
                }
            }
        }
    };
    angular.module('shareBJ.lib')
        .directive("sbjSlideBox",directive);
}());
