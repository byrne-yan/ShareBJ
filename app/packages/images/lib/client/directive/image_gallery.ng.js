function galleryDebug(){
    if(Images.debug)
        console.log.apply(console,arguments);
}


angular.module('shareBJ.lib')
    .directive('sbjGallery',function(){
        return {
            restrict: 'E',
            scope: {
                images: '=',
                src: '@',
                orientation: '@',
                start: '@',
                onclose:'&'
            },

            replace: "true",
            templateUrl: "sbj_images_lib/client/directive/image_gallery.ng.html",

            controller: function ($scope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaFile) {
                var getProperty = function(obj, propertyName,remap){
                    if(obj && propertyName){
                        var props = propertyName.split('.');
                        var newVal = _.reduce(props,function(newObj,prop){
                            return  newObj[prop];
                        },obj);
                        if(Meteor.isCordova && (_.isUndefined(remap) || remap) )
                            return Images.server.remapuri(newVal);
                        else
                            return newVal;
                    }
                };

                $scope.currentImage = $scope.start;
                $scope.nodelay = false;
                $scope.zoomMin = 1;
                $scope.updateStatus = function(){
                    var position = $ionicScrollDelegate.$getByHandle('scrollHandleGallery').getScrollPosition();
                    var zoomFactor = position.zoom;
                    //galleryDebug("zoom:",zoomFactor , $scope.zoomMin);
                    if(zoomFactor == $scope.zoomMin){
                        $scope.enableSlide = true;
                    }else{
                        $scope.enableSlide = false;
                    }
                };

                $scope.onSwipeLeft = function() {
                    if ($scope.enableSlide && $scope.currentImage < $scope.images.length-1) {
                        $scope.currentImage++;
                        $scope.loaded = false;
                        $scope.nodelay = false;
                    }
                }

                $scope.onSwipeRight = function(){
                    if ($scope.enableSlide && $scope.currentImage > 0) {
                        $scope.currentImage--;
                        $scope.loaded = false;
                        $scope.nodelay = false;
                    }
                }
                $scope.onImgLoad = function(event){
                    galleryDebug("img loaded:");
                    var image = angular.element(event.target);
                    var imageDiv = angular.element(event.target).parent();

                    //image dimension
                    var iw = image.width();
                    var ih = image.height();

                    //div dimension
                    var sw =  imageDiv.width();
                    var sh =  imageDiv.height();
                    var orientation = getProperty($scope.images[$scope.currentImage],$scope.orientation);
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
                            galleryDebug("set image container layout:",nw,nh,iw,ih,sw,sh,ratio,scale,left);
                            var position = $ionicScrollDelegate.$getByHandle('scrollHandleGallery').getScrollPosition();
                            galleryDebug(position);
                            $ionicScrollDelegate.$getByHandle('scrollHandleGallery').scrollBy(-position.left,-position.top,false);
                        }
                    }
                    $scope.loaded = true;
                    $timeout(function(){$scope.nodelay = true},100);
                };

                $scope.getOrientation = function(){
                    return getProperty($scope.images[$scope.currentImage],$scope.orientation);
                }
                $scope.imageSrc = function(){
                    return getProperty($scope.images[$scope.currentImage],$scope.src);
                }
                $scope.bgImage = function(){
                    return $scope.loaded?'url(' + getProperty($scope.images[$scope.currentImage],$scope.src) +')':'none';
                };
                $scope.getIndicator = function(){
                    var c = $scope.currentImage;
                    c++;
                    return c;
                };
                $scope.closeModal = function(){
                    $scope.onclose();
                }
                $scope.deleteImage = function(){

                    var cached_uri = getProperty($scope.images[$scope.currentImage],$scope.src,false);
                    galleryDebug('remove cache:',cached_uri);
                    Images.cacheManager.index.removeByCachedURI(cached_uri);
                }
            }
        }
    })