angular.module('shareBJ.journals')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('journals',{
                cache:false,
                url:'/journals',
                templateUrl: 'sbj_journals_lib/client/journals.ng.html',
                controller: 'JournalsCtrl',
                resovle:{
                    "currentUser": function ($meteor) {
                        return $meteor.requireUser();
                    }
                }
            });

        $urlRouterProvider.otherwise('/journals');
    })