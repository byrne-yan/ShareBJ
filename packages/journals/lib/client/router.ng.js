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
                url:'/list?baby',
                views:{
                    'journalView':{
                        templateUrl: 'sbj_journals_lib/client/journals.ng.html',
                        controller: 'JournalsCtrl'
                    }
                },
                resolve:{
                    'currentUser': function($meteor){
                        return $meteor.requireUser();
                    },
                    'babiesSub':function($meteor, currentUser){
                        if(currentUser)
                            return $meteor.subscribe('myGuardianOrFollowingBabies',{sort: { conceptionDate: -1, "birth.birthTime": -1}});
                    },
                    'babies': function($meteor,currentUser){
                        return $meteor.collection(function(){
                                return Babies.find({$or:[{followers:currentUser._id},{owners:currentUser._id}]},{
                                    sort: { conceptionDate: -1, "birth.birthTime": -1}
                                })
                            }
                            ,false
                        );
                    }
                },
                onEnter: function(babies,$state){

                    //no baby to guard or follow, go to baby guard or following page
                    if(babies.length === 0)
                    {
                        console.log("no baby guarded");
                        //throw "BABY_GUARD_REQUIRED";
                        //$state.go('shareBJ.babies.list');
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