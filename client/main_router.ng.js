angular.module('shareBJ')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home',{
                url:'/journals',
                templateUrl: 'client/journals.ng.html',
                controller: 'JournalsCtrl',
                resovle:{
                    "currentUser": function ($meteor) {
                        return $meteor.requireUser();
                    }
                }
            });

        $urlRouterProvider.otherwise('/journals');
    })
    .run(function($rootScope,$state){
            $rootScope.$on('$stateChangeError',function(event,toState,toParams,fromState,fromParams,error){
                if (error === 'AUTH_REQUIRED'){
                    $state.go('users_login');
                }
            });
    });