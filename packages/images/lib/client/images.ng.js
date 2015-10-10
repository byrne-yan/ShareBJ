angular.module('shareBJ.images', ['shareBJ.lib']);

ShareBJ.menu.uploadDashboard = 'sbj_images_lib/client/uploading_menu.ng.html';

angular.module('shareBJ.images')
.controller('UploadDashCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){
        //$scope.uploads = $scope.$meteorCollection(null,false).find();
        //Uploads.updateProgress();

        Tracker.autorun(function(){
            $scope.uploads = Uploads.find({status:{$nin:['failed','aborted','done']}}).fetch();

            $timeout( function(){} );
        });

        $scope.cancelUpload = function(uploaderId){
            Uploads.getUploader(uploaderId).abort()
            .then(function(){
                    Uploads.removeUploader(uploaderId);
                })
        }
    });