angular.module('shareBJ.users')
    .controller('SignupCtrl',['$scope','$meteor','$state',function($scope,$meteor,$state){
        $scope.signup = function(){
            $scope.signupError = {signup:false};
            $meteor.createUser({
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                profile:{
                    name:$scope.name || $scope.username,
                    mobiles:[{
                        number:$scope.mobile,verified:false
                    }]
                }
            })
                .then(function(){
                    $state.go('home');
                },
                function(error){
                    $scope.signupError = {signup:true};
                    $scope.signupErrorMessage = error.message;
                    switch (error.reason){
                        case "Username already exists.":
                            $scope.signupErrorMessage = "该用户名已经被使用，请换个用户名";
                            break;
                    }
                    console.log(error);
                })
            }
    }]);