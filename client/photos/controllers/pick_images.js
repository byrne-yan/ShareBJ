angular.module("shareBJ").controller('LocalPhotosCtrl', function($scope, $sce) {
    $scope.localImgSrc = $sce.trustAsResourceUrl('C:\\Users\\byrne_000\\OneDrive\\Pictures/mmexport1425360434926.jpeg');
});