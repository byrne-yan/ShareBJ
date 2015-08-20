angular.module('shareBJ.babies')
    .controller('InvitationsFeedbackCtrl',function($scope,$meteor,$rootScope,$stateParams,$ionicNavBarDelegate,$ionicPopup) {

        $scope.baby = $stateParams.baby;
        $scope.error = null;
        $meteor.call('AcceptInvitation',$stateParams.token,$stateParams.invitor).then(
            function(){
                $scope.result = "亲，你可以查看宝宝日志了";
            },
            function(error){
                $scope.error = error.message;
            }
        )
    });