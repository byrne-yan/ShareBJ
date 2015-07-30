angular.module('shareBJ',['shareBJ.users']);

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


