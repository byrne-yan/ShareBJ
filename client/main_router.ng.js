angular.module('shareBJ')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        ShareBJ.state.menu = 'shareBJ';
        ShareBJ.state.home = 'shareBJ.journals';
        $stateProvider
            .state(ShareBJ.state.menu,{
                url:'',
                abstract:true,
                templateUrl:'client/menu.ng.html',
                controller:'AppCtrl'
            })
            //.state(ShareBJ.state.menu,{
            //    url:'/',
            //    abstract:true,
            //    templateUrl:'client/root.ng.html',
            //    controller:'RootCtrl'
            //})
        ;

        $urlRouterProvider.otherwise('/journals');
    })
    .run(function($rootScope,$state,$meteor,$ionicHistory){
        $rootScope.$on('$stateChangeError',function(event,toState,toParams,fromState,fromParams,error){
            console.log("$stateChangeError:",event,toState,toParams,fromState,fromParams,error);
            if (error === 'AUTH_REQUIRED'){
                $state.go(ShareBJ.state.login);
            }
        });
        $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
            console.log("$stateChangeStart:",event,toState,toParams,fromState,fromParams);
            console.log($ionicHistory.viewHistory());
        });
        $rootScope.$on('$stateChangeSuccess',function(event,toState,toParams,fromState,fromParams,error){
            console.log("$stateChangeSuccess:",event,toState,toParams,fromState,fromParams);
            console.log($ionicHistory.viewHistory());
            //if done from login to any state, resotre backView setting
            if(fromState.name==='shareBJ.users_login')
            {
                $ionicHistory.nextViewOptions(null);
            }
        });
    });