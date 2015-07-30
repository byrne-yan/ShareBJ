angular.module('shareBJ.users')
    .controller('LoginCtrl',function($scope,$meteor,$state){
        $scope.login = function(){
            $scope.loginError = {'login':false};
            $meteor.loginWithPassword($scope.username,$scope.password).then(function(){
                    $state.go('home');
                },
                function(error){
                    $scope.loginError = {'login':true};
                    $scope.loginErrorMessage = error.message;
                    switch (error.reason) {
                        case "User not found":
                            $scope.loginErrorMessage = "该用户不存在，请重新输入用户名！";
                            break;
                        case "Incorrect password":
                            $scope.loginErrorMessage = "密码不正确，请重新输入密码！";
                            break;
                    }
                    //console.log(error);
                }
            );
        }
    });