angular.module('shareBJ.images', ['shareBJ.lib']);

angular.module('shareBJ.images')
.controller('UploadDashCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){

        $scope.$meteorAutorun(function(){
            //$scope.uploads = Uploads.find({status:{$nin:['failed','aborted','done']}}).fetch();
            $scope.uploads = Uploads.find({},{
                sort:[
                    ["start","desc"]
                ]
            }).fetch();

            $timeout( function(){} );
        });

        $scope.cancelUpload = function(uploaderId){
            var uploader = Images.uploadManager.getUploader(uploaderId);
            if(uploader)
            {
                uploader.abort()
                .then(function(){
                        Images.uploadManager.removeUploader(uploaderId);
                })
            }
        }
    });