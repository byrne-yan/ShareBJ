angular.module('shareBJ',['angular-meteor','ui.router', 'ionic']);

// to get meteor app on cordova with angular integration
function onReady() {
    angular.bootstrap(document, ['shareBJ']);
}

if (Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
else
    angular.element(document).ready(onReady);


