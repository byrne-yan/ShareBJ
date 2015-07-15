angular.module("shareBJ")
    .controller('LoginCtrl', ['$scope','$meteor','$state', '$timeout',
        function($scope,$meteor,$state, $timeout){
            $scope.login = function(){
                var name = $scope.username;
                var passwd =$scope.password;
                if( name && passwd )
                {
                    Meteor.loginWithPassword(name,passwd, function(error){
                        if(!error)
                        {
                            $state.go('journals');
                        }else
                        {
                            console.log(error);
                        }
                    })
                }
            }

        }]);