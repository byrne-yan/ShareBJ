angular.module('shareBJ')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){;
        $locationProvider.html5Mode(true);

        ShareBJ.home = 'journals';
        $stateProvider
            .state('root',{
                url:'/',
                templateUrl:'client/index.html',
                controller:'RootCtrl'
            })
        ;

        $urlRouterProvider.otherwise('/journals');
    })
    .run(function($rootScope,$state){
            $rootScope.$on('$stateChangeError',function(event,toState,toParams,fromState,fromParams,error){
                if (error === 'AUTH_REQUIRED'){
                    $state.go('users_login');
                }
            });
    });