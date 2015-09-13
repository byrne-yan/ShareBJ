angular.module('shareBJ.users')
    .controller('ChangePasswordCtrl',function($scope,$meteor,$state,$ionicHistory,$timeout) {
        $scope.input = {};
        $scope.error = {sbjError:{}};

        $scope.changePassword = function(){
            Accounts.changePassword($scope.input.oldpassword,$scope.input.password1,function(err){
                if(err){
                    console.log(err);
                    $scope.error.sbjError.sharebj = true;
                    $scope.error.sbjError.sharebjErrorMessage = err.message;
                }else{
                    $scope.cancel();
                }
            });
        };
        $scope.cancel = function(){
            if($ionicHistory.backView())
                $ionicHistory.goBack();
            else
                $state.go(ShareBJ.state.home);
        }

    })