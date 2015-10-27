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
                enableCache:'@',
                onclose:'&'
            },
            replace:"true",
            templateUrl: "sbj_images_lib/client/directive/imageslides_directive.ng.html",

            controller:function($scope,$timeout,$ionicSlideBoxDelegate,$ionicScrollDelegate,$cordovaFile){
                if(_.isUndefined($scope.enableCache))
                    $scope.enableCache = true;

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


                //$scope.slideImages = new Array($scope.images.length);
                //for(var i=0;i<$scope.images.length;++i){
                //    $scope.slideImages[i] = {
                //        src:getProperty($scope.images[i],$scope.src),
                //        thumb:getProperty($scope.images[i],$scope.thumb),
                //        orientation:getProperty($scope.images[i],$scope.orientation),
                //        loaded:false
                //    };
                //    console.log($scope.slideImages[i].src,$scope.slideImages[i].orientation);
                //};
                $scope.id = Random.id();
                Tracker.autorun(function(c){
                    _.each($scope.images,function(image,idx){
                        var thumb = getProperty($scope.images[idx],$scope.thumb);
                        var orientation = getProperty($scope.images[idx],$scope.orientation);
                        var url = getProperty($scope.images[idx],$scope.src);
                        LocalCollection.upsert({_type:'imageCache', jid:$scope.id, no:idx}, {$set:{orientation:orientation, thumb:thumb, src:$scope.enableCache?null:url, loaded:false}});
                        if($scope.enableCache){
                            if(url){
                                Images.cacheManager.cache(url,orientation,function(cachedURI){
                                    LocalCollection.update({_type:'imageCache', jid:$scope.id, no:idx },{$set: {src: Images.server.remapuri(cachedURI) } })
                                })
                            }else{
                                console.log("WARN: no image url ");
                            }
                        }
                    });

                    $timeout(function(){});
                });

                $scope.$on('$destroy',function(){
                    LocalCollection.remove({_type:'imageCache', jid:$scope.id});
                });

                Tracker.autorun(function(c) {
                    $scope.slideImages = LocalCollection.find({_type: 'imageCache', jid: $scope.id}).fetch();
                    console.log('images updated',$scope.slideImages);
                });

                $scope.zoomMin = 1;
                $scope.updateSlideStatus = function(slide){
                    var position = $ionicScrollDelegate.$getByHandle('scrollHandle'+slide).getScrollPosition();
                    console.log("scrool position:",position);
                    var zoomFactor = position.zoom;
                    //console.log("zoom:",zoomFactor , $scope.zoomMin);
                    if(zoomFactor == $scope.zoomMin){
                        $ionicSlideBoxDelegate.enableSlide(true);
                    }else{
                        $ionicSlideBoxDelegate.enableSlide(false);
                    }
                };

                $scope.onImgLoad = function(event,idx){
                    console.log("img loaded:",idx);
                    var image = angular.element(event.target);
                    var imageDiv = angular.element(event.target).parent();

                    //image dimension
                    var iw = image.width();
                    var ih = image.height();

                    //div dimension
                    var sw =  imageDiv.width();
                    var sh =  imageDiv.height();
                    var orientation = getProperty($scope.images[idx],$scope.orientation);
                    if(orientation===5 || orientation===6 || orientation===7 || orientation===8)
                    {
                        //strech div to ensure fit the height after rotation
                        if(iw > ih){
                            var ratio = 1.0*iw/ih;//ratio must be kept
                            var scale = 1.0*sh/sw;
                            var nw = Math.floor(sh);
                            var nh = Math.floor(nw*ratio);
                            imageDiv.height(nw);
                            imageDiv.width(nw);
                            var left = -parseInt(nw/2- (nw/ratio)/2);
                            imageDiv.css('left',left);
                            console.log("set image container layout:",nw,nh,iw,ih,sw,sh,ratio,scale,left);
                        }
                        ////imageDiv.css('background-size',w);

                        //console.log('get size:',w,h,ratio, typeof w);


                        //var leftAt = parseInt(-(nw/2-w/2));
                        //imageDiv.css('left', leftAt );
                        //console.log("set image container layout:",nh,nh,leftAt,nw,w,h,ratio);
                        //$scope.slideImages[idx].loaded = true;
                    }
                    LocalCollection.update({_type:'imageCache', jid:$scope.id, no:idx },{$set: {loaded:true}});
                    $ionicSlideBoxDelegate.update();
                };
                $scope.closeModal = function(){
                    $scope.onclose();
                };

                $scope.bgImage = function(image){
                    return image && image.loaded?'url(' + image.src +')':'none';
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
