angular.module('shareBJ')
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider){

            $locationProvider.html5Mode(true);

            $stateProvider
                .state('journals', {
                    url: '/journals',
                    templateUrl: 'client/journals/views/journals_list.ng.html',
                    controller: 'JournalsListCtrl',
                    resolve: {
                        "currentUser": ["$meteor", function($meteor){
                            return $meteor.requireUser();
                        }]
                    }
                })
            //.state('photos',{
            //        url:'/photos',
            //        templateUrl:'client/photos/views/pick_images.ng.html' ,
            //        controller:'LocalPhotosCtrl'
            //    })
            .state('journals.new',{
                url:'/journals/new',
                templateUrl:'client/journals/views/journal_new.ng.html' ,
                controller:'JournalCtrl'
            })
            .state('home',{
                url: '/',
                templateUrl:'client/home/views/home.ng.html',
                controller:'HomeCtrl',
                resolve: {
                    "currentUser": ["$meteor", function($meteor){
                        return $meteor.waitForUser();
                    }]
                }
            })
            ;
            $urlRouterProvider.otherwise('/journals');
        }]);
angular.module("shareBJ").run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireUser promise is rejected
        // and redirect the user back to the main page
        if (error === "AUTH_REQUIRED") {
            $state.go('home');
        }
    });
    Accounts.onLogin(function () {
        if ($state.is('home')) {
            $state.go('journals');
        }
    });

    Accounts.onLoginFailure(function () {
        $state.go('home');
    });

}]);