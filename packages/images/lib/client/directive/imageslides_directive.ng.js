(function(){
    var directive = function(){
        return {
            restrict: 'E',
            scope:{
                images:'=',
                thumb:'@',
                src:'@',
                orientation:'@',
                start:'@',
                showTrash:'@',
                onclose:'&'
            },
            replace:"true",
            templateUrl: "sbj_images_lib/client/directive/imageslides_directive.ng.html",

            controller:function($scope,$timeout,$ionicSlideBoxDelegate,$ionicScrollDelegate,$cordovaFile){
                var getProperty = function(obj, propertyName){
                    if(obj && propertyName){
                        var props = propertyName.split('.');
                        var newVal = _.reduce(props,function(newObj,prop){
                            return  newObj[prop];
                        },obj);
                        if(Meteor.isCordova)
                            return Images.server.remapuri(newVal);
                        else
                            return newVal;
                    }
                };

                $scope.activeSlide = $scope.start;


                $scope.slideImages = new Array($scope.images.length);
                for(var i=0;i<$scope.images.length;++i){
                    $scope.slideImages[i] = {
                        src:getProperty($scope.images[i],$scope.src),
                        thumb:getProperty($scope.images[i],$scope.thumb),
                        orientation:getProperty($scope.images[i],$scope.orientation),
                        loaded:false
                    };
                    console.log($scope.slideImages[i].src,$scope.slideImages[i].orientation);
                };

                $scope.zoomMin = 1;
                $scope.updateSlideStatus = function(slide){
                    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle'+slide).getScrollPosition().zoom;
                    //console.log("zoom:",zoomFactor , $scope.zoomMin);
                    if(zoomFactor == $scope.zoomMin){
                        $ionicSlideBoxDelegate.enableSlide(true);
                    }else{
                        $ionicSlideBoxDelegate.enableSlide(false);
                    }
                };

                $scope.onImgLoad = function(event,idx){
                    //console.log("img loaded:",event,idx);
                    var imageDiv = angular.element(event.target).parent();
                    //console.log(imageDiv);
                    var w = parseInt( imageDiv.css('width'));
                    var h = parseInt( imageDiv.css('height'));
                    ////imageDiv.css('background-size',w);
                    var ratio = 1.0*h/w;
                    //console.log('get size:',w,h,ratio, typeof w);
                    var nw = Math.floor(h*ratio);
                    var nh = Math.floor(w*ratio);
                    imageDiv.css('width',nh);
                    imageDiv.css('height',nh);
                    imageDiv.css('left', -(nh/2-w/2) );
                    $scope.slideImages[idx].loaded = true;
                    $ionicSlideBoxDelegate.update();
                };
                $scope.closeModal = function(){
                    $scope.onclose();
                };

                $scope.bgImage = function(image){
                    return image.loaded?'url(' + image.src +')':'none';
                };
                $scope.slideChanged = function($index){
                    console.log('slideChanged to:',$index,$scope.activeSlide);

                };
                $scope.repeatDone = function( ){
                    console.log('repeat done');
                    if(Session.get('image-slide-changed'))
                        $ionicSlideBoxDelegate.update();
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
        .directive("sbjSlideBox",directive)
        .directive('repeatDone',function(){
            return function(scope,element,attrs){
                if(scope.$last){//all are rendered
                    scope.$eval(attrs.repeatDone);
                }
            }
        })
        .directive('sbjLoad',function($parse){
            return {
                restrict:'A',
                link: function(scope,elem,attrs){
                    var data = scope.$eval(attrs.sbjData);
                    var fn = $parse(attrs.sbjLoad);
                    elem.on('load',function(event){
                        scope.$apply(function(){
                            fn(scope,{$event:event,$data:data});
                        })
                    })
                }
            }
        })
    ;
}());
