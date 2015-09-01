angular.module('shareBJ.users')
    .controller('LoginCtrl',function($scope,$meteor,$state,$ionicHistory){

        $scope.user ={};
        $scope.login = function(){
            $scope.user.loginError = {'login':false};
            Meteor.loginWithPasswordEx($scope.user.username,$scope.user.password,function(error){
                if(error){
                    $scope.user.loginError = {'login':true};
                    $scope.loginErrorMessage = error.message;
                    switch (error.reason) {
                        case "User not found":
                            $scope.loginErrorMessage = "该用户不存在，请重新输入用户名！";
                            break;
                        case "Incorrect password":
                            $scope.loginErrorMessage = "密码不正确，请重新输入密码！";
                            break;
                    }
                    console.log(error);
                }else{
                    $scope.user.password="";
                    $state.go(ShareBJ.state.home);

                }
            });
        }
    });