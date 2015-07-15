angular.module("shareBJ")
    .controller('EnrollCtrl', ['$scope','$meteor','$state', '$timeout',
        function($scope,$meteor,$state, $timeout){
            $scope.enroll = function(){
                Accounts.createUser({
                    username:$scope.username,
                    email:'',
                    password:$scope.password,
                    profile:{
                        mobile:$scope.mobile
                    }
                }, function(error){
                    if(!error)
                    {
                        $state.go('login');
                    }else
                    {
                        console.log(error);
                    }
                });
            }

        }]
    );