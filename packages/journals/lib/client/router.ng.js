angular.module('shareBJ.journals')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        ShareBJ.state.journals ='shareBJ.journals';
        $stateProvider
            .state(ShareBJ.state.journals,{
                //cache:false,
                url:'/journals',
                views:{
                    'menuContent':{
                        templateUrl: 'sbj_journals_lib/client/journals.ng.html',
                        controller: 'JournalsCtrl'
                    }
                },
                resolve:{
                    "currentUser": function ($meteor) {
                        return $meteor.requireUser();
                    },
                    "customData":function(){
                        return {value:'custom data'}
                    }
                }
            });
    });