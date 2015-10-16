angular.module('shareBJ.images', ['shareBJ.lib']);

ShareBJ.menu.uploadDashboard = 'sbj_images_lib/client/uploading_menu.ng.html';

angular.module('shareBJ.images')
.controller('UploadDashCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){

        $scope.$meteorAutorun(function(){
            $scope.uploads = Uploads.find({status:{$nin:['failed','aborted','done']}}).fetch();

            $timeout( function(){} );
        });

        $scope.cancelUpload = function(uploaderId){
            var uploader = Uploads.getUploader(uploaderId);
            if(uploader)
            {
                uploader.abort()
                .then(function(){
                    Uploads.removeUploader(uploaderId);
                })
            }
        }
    });