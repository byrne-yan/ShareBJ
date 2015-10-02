angular.module('shareBJ.images', ['shareBJ.lib']);

ShareBJ.menu.uploadDashboard = 'sbj_images_lib/client/uploading_menu.ng.html';

angular.module('shareBJ.images')
.controller('UploadDashCtrl',($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal)=>{
        //$scope.uploads = $scope.$meteorCollection(null,false).find();
        //Uploads.updateProgress();

        Tracker.autorun(()=>{
            $scope.uploads = Uploads.find({$and:[
                {progress:{$gte:0}},
                {progress:{$lt:100}}
            ]}).fetch();
            //console.log("=====",$scope.uploads);
            $timeout( ()=> $scope.$apply(()=>{}) );
        });

        $scope.cancelUpload = (uploaderId)=>{
            Uploads.getUploader(uploaderId).abort()
            .then(()=>{
                    Uploads.removeUploader(uploaderId);
                })
        }
    });