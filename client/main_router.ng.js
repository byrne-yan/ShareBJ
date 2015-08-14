angular.module('shareBJ')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        ShareBJ.state.menu = 'shareBJ';
        ShareBJ.state.home = 'shareBJ.journals.list';
        $stateProvider
            .state(ShareBJ.state.menu,{
                url:'',
                abstract:true,
                templateUrl:'client/menu.ng.html',
                controller:'AppCtrl'
            })
        ;

        $urlRouterProvider.otherwise('/journals/list');
    })
    .run(function($rootScope,$state,$meteor,$ionicHistory){
        $rootScope.$on('$stateChangeError',function(event,toState,toParams,fromState,fromParams,error){
            console.log("$stateChangeError:",event,toState,toParams,fromState,fromParams,error);
            if (error === 'AUTH_REQUIRED'){
                $state.go(ShareBJ.state.login);
            }else if( error === 'BABY_GUARD_REQUIRED'){
                //TODO:transit to guard a baby
                console.log('BABY_GUARD_REQUIRED');
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
            //if(fromState.name==='shareBJ.users_login')
            //{
            //    $ionicHistory.nextViewOptions(null);
            //}
        });
        $rootScope.$on('$viewContentLoading',function(event){
            console.log('$viewContentLoading',event);
        });
        $rootScope.$on('$stateNotFound',function(event,unfoundState, fromState, fromParams){
            console.log('$stateNotFound',event,unfoundState,fromState,fromParams);
        });

        $rootScope.$on('$routeChangeError',function(current,previous,rejection){
            console.log('$routeChangeError',current,previous,rejection);
        });

        $rootScope.$on('$routeChangeStart', function(next,current){
            console.log('$routeChangeStart',next,current);
        });
        $rootScope.$on('$routeChangeSuccess',function(current,previous){
            console.log('$routeChangeSuccess',current,previous);
        });
        $rootScope.$on('$routeUpdate', function(rootScope){
            console.log('$routeUpdate',rootScope);
        })


    });