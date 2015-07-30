angular.module('shareBJ',['shareBJ.users','shareBJ.journals'])
    .controller('RootCtrl',function($scope) {

    })
    .controller('BabiesCtrl',function($scope){
        $scope.babies = [
            {name:"芋头１",birthTime:new Date(2015,5,9,11,20)},
            {name:"芋头2",birthTime:new Date(2014,2,9,18,55)}
        ]
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


