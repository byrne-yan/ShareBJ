function slidesDebug(){
    if(Images.slidesDebug)
        console.log.apply(console,arguments);
}

(function(){
    var directive = function(){
        return {
            restrict: 'E',
            scope:{
                images:'=',
                thumb:'@',
                src:'@',
                src2:'@',
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


                $scope.id = Random.id();

                function getImageDivLayout(image,idx,orientation){
                    var imageDiv = angular.element("#img-div-"+idx);

                    //image dimension
                    var iw = image.width;
                    var ih = image.height;

                    //div dimension
                    var sw =  imageDiv.width();
                    var sh =  imageDiv.height();
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
                            //imageDiv.css('left',left);
                            slidesDebug("set image container layout:",nw,nh,iw,ih,sw,sh,ratio,scale,left);
                            return [left,nw];
                        }
                    }
                }
                function loadImg(url, data,callback){
                    var i = new Image();
                    i.onload = function(event){
                        slidesDebug('img loaded:',url, data);
                        var r = getImageDivLayout(i,data.no,data.orientation);
                        if(r){
                            data.left = r[0];
                            data.width = r[1];
                        }
                        callback(data);
                    };
                    i.src = url;
                }
                $scope.$meteorAutorun(function(c){
                    slidesDebug('images changes',$scope.images);
                    _.each($scope.images,function(image,idx){
                        var thumb = getProperty($scope.images[idx],$scope.thumb);
                        var orientation = getProperty($scope.images[idx],$scope.orientation);
                        var url = getProperty($scope.images[idx],$scope.src) || getProperty($scope.images[idx],$scope.src2);

                        LocalCollection.upsert({_type:'imageCache', jid:$scope.id, no:idx}, {$set:{
                            _type:'imageCache', jid:$scope.id, no:idx,orientation:orientation, thumb:thumb, src:null, loaded:false
                        }});
                            if(url){
                                if($scope.enableCache) {
                                    Images.cacheManager.cache(url, orientation, function (cachedURI) {
                                        var src = Images.server.remapuri(cachedURI);
                                        slidesDebug('img src:', src, idx);
                                        loadImg(src,{jid:$scope.id,no:idx,orientation:orientation},function(res){
                                            LocalCollection.update({_type:'imageCache', jid:res.jid, no:res.no },{$set:
                                                {src:url,loaded:true, width:res.width, left:res.left}
                                            });
                                        })

                                    })
                                }else{
                                    loadImg(url,{jid:$scope.id,no:idx,orientation:orientation},function(res){
                                        LocalCollection.update({_type:'imageCache', jid:res.jid, no:res.no },{$set:
                                        {src:url,loaded:true, width:res.width, left:res.left}
                                        });
                                    })
                                }
                            }else{
                                slidesDebug("WARN: no image url ");
                                LocalCollection.update({_type:'imageCache', jid:$scope.id, no:idx },{$set: {src:thumb,loaded:true}});
                            }
                    });
                });


                $scope.$on('$destroy',function(){
                    LocalCollection.remove({_type:'imageCache', jid:$scope.id});
                });


                function updateSlides(){
                    setTimeout(function(){
                        //$ionicSlideBoxDelegate.slide(0);
                        $ionicSlideBoxDelegate.update();
                        $scope.$apply();
                    });
                }
                $scope.$meteorAutorun(function(c) {
                    $scope.slideImages = LocalCollection.find({_type: 'imageCache', jid: $scope.id}).fetch();
                    slidesDebug('slideImages updated',$scope.slideImages);
                    updateSlides();
                });

                $scope.zoomMin = 1;
                $scope.updateSlideStatus = function(slide){
                    var position = $ionicScrollDelegate.$getByHandle('scrollHandle'+slide).getScrollPosition();
                    //slidesDebug("scrool position:",position);
                    var zoomFactor = position.zoom;
                    //slidesDebug("zoom:",zoomFactor , $scope.zoomMin);
                    if(zoomFactor == $scope.zoomMin){
                        $ionicSlideBoxDelegate.enableSlide(true);
                    }else{
                        $ionicSlideBoxDelegate.enableSlide(false);
                    }
                };

                $scope.closeModal = function(){
                    $scope.onclose();
                };

                $scope.bgImage = function(image){
                    return image && image.loaded?'url(' + image.src +')':'none';
                };
                $scope.slideChanged = function($index){
                    slidesDebug('slideChanged to:',$index,$scope.activeSlide);
                };
                $scope.repeatDone = function(){
                    slidesDebug('repeatDone');
                };
                $scope.deleteImage = function(e){
                    slidesDebug("try to delete image #" + $ionicSlideBoxDelegate.currentIndex());
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
