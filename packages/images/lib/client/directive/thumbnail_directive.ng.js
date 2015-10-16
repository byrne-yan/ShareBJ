(function(){
    var directive = function(){
        function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

            var result = { width: 0, height: 0, fScaleToTargetWidth: true };

            if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
                return result;
            }

            // scale to the target width
            var scaleX1 = targetwidth;
            var scaleY1 = (srcheight * targetwidth) / srcwidth;

            // scale to the target height
            var scaleX2 = (srcwidth * targetheight) / srcheight;
            var scaleY2 = targetheight;

            // now figure out which one we should use
            var fScaleOnWidth = (scaleX2 > targetwidth);
            if (fScaleOnWidth) {
                fScaleOnWidth = fLetterBox;
            }
            else {
                fScaleOnWidth = !fLetterBox;
            }

            if (fScaleOnWidth) {
                result.width = Math.floor(scaleX1);
                result.height = Math.floor(scaleY1);
                result.fScaleToTargetWidth = true;
            }
            else {
                result.width = Math.floor(scaleX2);
                result.height = Math.floor(scaleY2);
                result.fScaleToTargetWidth = false;
            }
            result.targetleft = Math.floor((targetwidth - result.width) / 2);
            result.targettop = Math.floor((targetheight - result.height) / 2);

            return result;
        }

        return {
            restrict: 'E',
            scope:{
                thumbWidth:'@',
                thumbHeight:'@',
                thumbStamp:'@',
                orientation:'@',
                ngSrc:'='
            },
            replace:"true",
            templateUrl: "sbj_images_lib/client/directive/thumbnail_directive.ng.html",
            link:function(scope,element,attrs){
                function fit(e){
                    //console.log("img.load：",e,this);
                    var img = e.currentTarget;

                    var w = img.width;
                    var h = img.height;

                    var tw = scope.thumbWidth;
                    var th = scope.thumbWidth;

                    // compute the new size and offsets
                    var result = ScaleImage(w, h, tw, th, false);

                    // adjust the image coordinates and size
                    //console.log(result);
                    img.width = result.width;
                    img.height = result.height;
                    img.style.left = result.targetleft + "px";
                    img.style.top = result.targettop + "px";                }

                var img = $('img',$(element));
                if(img){
                    img.bind("load",fit);
                }
            },
            controller:function($scope){
                $scope.containerStyle = {
                    width: $scope.thumbWidth + 'px',
                    height: $scope.thumbHeight + 'px'
                };
            }
        }

    };
    angular.module('shareBJ.lib')
        .directive("sbjThumbnail",directive);
}());
