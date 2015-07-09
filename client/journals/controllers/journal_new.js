angular.module("shareBJ").controller('JournalCtrl', ['$scope',
    function($scope){
        $scope.pickedImages = [
            {
                url: 'images/plus.jpg',
                isButton: true
            }
        ];
        $scope.publicFor = '公开';
        $scope.send = function(){
            //upload images
            //insert a journal
        }
    }]);