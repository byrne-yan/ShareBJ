angular.module('shareBJ.journals')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        ShareBJ.state.journals ='shareBJ.journals.list';
        $stateProvider
            .state('shareBJ.journals',{
               abstract:true,
                url:'/journals',
                views: {
                    'menuContent': {
                        templateUrl:'sbj_journals_lib/client/journals_main.ng.html',
                        controller:function(){}
                    }
                },
                resolve:{
                    "currentUser": function ($meteor) {
                        return $meteor.requireUser();
                    }
                }
            })
            .state(ShareBJ.state.journals,{
                //cache:false,
                url:'/list',
                views:{
                    'journalView':{
                        templateUrl: 'sbj_journals_lib/client/journals.ng.html',
                        controller: 'JournalsCtrl'
                    }
                },
                resolve:{
                    'babies':function($meteor){
                        return $meteor.subscribe('myBabies',{sort: { conceptionDate: -1, "birth.birthTime": -1}});
                    }
                }
            })
            .state('shareBJ.journals.new',{
                url:'/new',
                views:{
                    'journalView':{
                        templateUrl: 'sbj_journals_lib/client/new_journal.ng.html',
                        controller:'NewJournalCtrl'
                    }
                }
            })
        ;
    });