angular.module('shareBJ',['shareBJ.users','shareBJ.babies','shareBJ.journals'])
    .controller('AppCtrl',function($scope,$state,$meteor,$ionicHistory) {
        $scope.menuBabies = ShareBJ.menu.babiesList;
        $scope.menuUserSummary = ShareBJ.menu.userSummary;
        $scope.logout = function(){
            $meteor.logout().then(
                function(){
                    $ionicHistory.nextViewOptions({
                       historyRoot:true
                    });
                    $state.go(ShareBJ.state.login);
                },
                function(error){
                    console.log(error);
                }
            )
        }
    })
;



// to get meteor app on cordova with angular integration
Meteor.startup(function(){
    function onReady() {
        angular.bootstrap(document, ['shareBJ']);
    }

    if (Meteor.isCordova)
        angular.element(document).on("deviceready", onReady);
    else
        angular.element(document).ready(onReady);
});


