//angular.module('shareBJ')
//    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
//        function($urlRouterProvider, $stateProvider, $locationProvider){
//
//            $locationProvider.html5Mode(true);
//
//            $stateProvider
                //.state('login',{
                //    url: '/login',
                //    templateUrl:'client/home/views/login.ng.html',
                //    controller:'LoginCtrl',
                //    resolve: {
                //        "currentUser": ["$meteor", function($meteor){
                //            return !$meteor.requireUser();
                //        }]
                //    }
                //})
                //.state('enroll',{
                //    url: '/enroll',
                //    templateUrl:'client/home/views/user_enroll.ng.html',
                //    controller:'EnrollCtrl',
                //    resolve: {
                //        "currentUser": ["$meteor", function($meteor){
                //            return !$meteor.requireUser();
                //        }]
                //    }
                //})
                //.state('journals', {
                //    url: '/journals',
                //    templateUrl: 'client/journals/views/journals_list.ng.html.bak',
                //    controller: 'JournalsListCtrl',
                //    resolve: {
                //        "currentUser": ["$meteor", function($meteor){
                //            return $meteor.requireUser();
                //        }]
                //    }
                //})
                ////.state('photos',{
                ////        url:'/photos',
                ////        templateUrl:'client/photos/views/pick_images.ng.html' ,
                ////        controller:'LocalPhotosCtrl'
                ////    })
                //.state('journals_new',{
                //    url:'/journals/new',
                //    templateUrl:'client/journals/views/journal_new.ng.html.bak' ,
                //    controller:'JournalNewCtrl',
                //    resolve: {
                //        "currentUser": ["$meteor", function($meteor){
                //            return $meteor.requireUser();
                //        }]
                //    }
                //})
                //.state('photo_detail',{
                //    url:'/cfs/files/images/:token',
                //    templateUrl:'client/photos/views/photo_detail.ng.html',
                //    controller: 'PhotoDetailCtrl',
                //    resolve: {
                //        "currentUser": ["$meteor", function($meteor){
                //            return $meteor.requireUser();
                //        }]
                //    }
                //})
                //.state('home',{
                //    url: '/',
                //    templateUrl:'client/home/views/home.ng.html',
                //    controller:'HomeCtrl'
                //})
        //    ;
        //
        //    $urlRouterProvider
        //        .otherwise('/journals');
        //}]);
//angular.module("shareBJ").run(["$rootScope", "$state", function($rootScope, $state) {
//    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
//        // We can catch the error thrown when the $requireUser promise is rejected
//        // and redirect the user back to the main page
//        if (error === "AUTH_REQUIRED") {
//            $state.go('login');
//        }
//    });
    //$rootScope.$on('$stateChangeStart',
    //    function(event, toState, toParams, fromState, fromParams){
    //        //event.preventDefault();
    //        console.log('$stateChangeStart');
    //        console.log(fromState);
    //        console.log(toState);
    //        // transitionTo() promise will be rejected with
    //        // a 'transition prevented' error
    //    });
    //$rootScope.$on('$stateChangeSuccess',
    //    function(event, toState, toParams, fromState, fromParams){
    //        //event.preventDefault();
    //        console.log('$stateChangeSuccess');
    //        console.log(fromState);
    //        console.log(toState);
    //        // transitionTo() promise will be rejected with
    //        // a 'transition prevented' error
    //    });
    //$rootScope.$on('$stateNotFound',
    //    function(event, unfoundState, fromState, fromParams){
    //        console.log('$stateNotFound:')
    //        console.log(unfoundState.to); // "lazy.state"
    //        console.log(unfoundState.toParams); // {a:1, b:2}
    //        console.log(unfoundState.options); // {inherit:false} + default options
    //    })

    //Accounts.onLogin(function () {
    //    $timeout(function(){
    //        $state.go('journals');
    //    }, 0);
    //});
    //
    //Accounts.onLoginFailure(function () {
    //    $state.go('login');
    //});

//}]);