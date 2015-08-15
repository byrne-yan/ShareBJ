if(!ShareBJ.menu)
    ShareBJ.menu = {};

ShareBJ.menu.babiesList = 'sbj_babies_lib/client/baby_menu.ng.html';

angular.module('shareBJ.babies')
    .config(  function($urlRouterProvider,$stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        //ShareBJ.state.baby = 'shareBJ.babies';
        ShareBJ.state.babyNew = 'shareBJ.babies.new';
        ShareBJ.state.babyEdit = 'shareBJ.babies.edit';

        $stateProvider
            .state('shareBJ.babies', {
                abstract: true,
                url: '/babies',
                views: {
                    'menuContent':{
                        templateUrl: "sbj_babies_lib/client/babies_main.ng.html",
                        controller: 'BabiesCtrl'
                    }
                },
                resolve: {
                    "currentUser": function ($meteor) {
                        return $meteor.requireUser();
                    }
                }
            })
            .state('shareBJ.babies.list',{
                url:'/list',
                views: {
                    'babyView': {
                        templateUrl: 'sbj_babies_lib/client/babies_list.ng.html',
                        controller: 'BabiesListCtrl'
                    }
                }
            })
            .state('shareBJ.babies.requests',{
                url:'/requests',
                views: {
                    'babyView': {
                        templateUrl: 'sbj_babies_lib/client/babies_requests.ng.html',
                        controller: 'BabiesRequestsCtrl'
                    }
                }

            })
            .state('shareBJ.babies.guardian',{
                url:'/guardian',
                views: {
                    'babyView': {
                        templateUrl: 'sbj_babies_lib/client/babies_takecareof.ng.html',
                        controller: 'BabiesGuardianCtrl'
                    }
                }

            })
            .state(ShareBJ.state.babyEdit, {
                url: '/:babyId',
                views: {
                    'babyView': {
                        templateUrl: 'sbj_babies_lib/client/new.ng.html',
                        controller: 'NewBabyCtrl'
                    }
                },
                resolve:{

                    "babiesSub":
                        function($meteor,currentUser){
                            return  $meteor.subscribe('myBabies', currentUser._id);
                        }
                }
            })
        ;
    });