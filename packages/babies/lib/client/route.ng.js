angular.module('shareBJ.babies')
    .config(  function($urlRouterProvider,$stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        //ShareBJ.state.baby = 'shareBJ.babies';
        ShareBJ.state.babyNew = 'shareBJ.babies_new';

        $stateProvider
            //.state('shareBJ.babies', {
            //    abstract: true,
            //    url: '/babies',
            //    views: {
            //        'menuContent':{
            //            template:'<p></p>',
            //            controller: 'BabiesCrtl'
            //        }
            //    }
            //})
            .state(ShareBJ.state.babyNew, {
                url: '/new',
                views: {
                    'menuContent': {
                        templateUrl: 'sbj_babies_lib/client/new.ng.html',
                        controller: 'NewBabyCtrl'
                    }
                },
                resolve:{
                    "currentUser":function($meteor){
                        return $meteor.requireUser();
                    },
                    "babiesSub":
                        function($meteor,currentUser){
                                return  $meteor.subscribe('myBabies', currentUser._id);
                        }
                }
            });
    });