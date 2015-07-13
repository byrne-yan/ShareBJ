angular.module("shareBJ")
    .controller('HomeCtrl', ['$scope','$meteor','$state', '$timeout',
    function($scope,$meteor,$state, $timeout){
        Accounts.onLogin( function() {
            $timeout(function(){
                $state.go('journals');
            }, 0);
        });
    }]);