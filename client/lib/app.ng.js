angular.module('shareBJ',['shareBJ.users','shareBJ.babies','shareBJ.journals'])
    .controller('AppCtrl',function($scope,$state,$meteor,$ionicHistory,$ionicPopover) {
        //$scope.popover = $ionicPopover.fromTemplate( '<ion-popover-view>' +
        //    '<ion-content><div class="list">' +
        //        '<div class="item item-button-left">' +
        //        '<button class="button button-clear" ui-sref="shareBJ.babies.requests">' +
        //        '   <i class="icon ion-email-unread assertive"></i>' +
        //        '</button>' +
        //        '</div>' +
        //    '</list></ion-content>' +
        //'</ion-popover-view>'
        //,{scope:$scope});

        $meteor.subscribe('myRequests')
            .then(function () {
                $scope.requestsCount = $scope.$meteorObject(Counts,'numOfMyRequests',false);
                //if($scope.requestsCount.count > 0){
                //    $scope.popover.show(".request-pop").then(function(){
                //        console.log('popover show');
                //    });
                //};
                //
                //if($scope.requestsCount.count === 0){
                //    $scope.popover.hide();
                //};
            });

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


