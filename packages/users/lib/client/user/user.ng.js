angular.module('shareBJ.users')
    .controller('UserCtrl',function($rootScope,$scope,$ionicHistory,$meteor,$state){
        if($rootScope.currentUser)
        {
            $scope.avatar = $rootScope.currentUser.profile.avatar || "images/hold32X32.png";
            $scope.username= $rootScope.currentUser.username;
            $scope.mobile= $rootScope.currentUser.profile.mobile;
            $scope.name = $rootScope.currentUser.profile.name || $rootScope.currentUser.username
            $scope.gender = $rootScope.currentUser.profile.gender || '未知';
            $scope.birthday = $rootScope.currentUser.profile.birthday;
        };
        $scope.goBack = function(){
            $ionicHistory.goBack();
        }
    });