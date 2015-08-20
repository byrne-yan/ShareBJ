angular.module('shareBJ.users')
    .controller('SignupCtrl',function($scope,$meteor,$state,$stateParams,$location){
        $scope.user = {};
        if($stateParams.mobile){
            $scope.user.mobile = $stateParams.mobile;
        };
        if($stateParams.email){
            $scope.user.email = $stateParams.email;
        };

        $scope.signup = function(){

            $scope.user.signupError = {signup:false};
            $meteor.createUser({
                username: $scope.user.username,
                email: $scope.user.email,
                password: $scope.user.password,
                profile:{
                    name:$scope.user.name || $scope.user.username,
                    mobiles:[{
                        number:$scope.user.mobile,verified:false
                    }],
                    token: $stateParams.token?$stateParams.token:null
                }
            })
                .then(function(){
                    $state.go(ShareBJ.state.home);
                },
                function(error){
                    $scope.user.signupError = {signup:true};
                    $scope.signupErrorMessage = error.message;
                    switch (error.reason){
                        case "Username already exists.":
                            $scope.signupErrorMessage = "该用户名已经被使用，请换个用户名";
                            break;
                        case "Email already exists.":
                            $scope.signupErrorMessage = "该电子邮箱地址已经被使用，请换个电子邮箱地址";
                            break;

                    }
                    console.log(error);
                })
            }
    });