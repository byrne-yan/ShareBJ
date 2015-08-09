if(!ShareBJ.menu)
    ShareBJ.menu = {};

ShareBJ.menu.babiesList = 'sbj_babies_lib/client/babies_list.ng.html';

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
                        template: " <ion-nav-bar class='bar-dark'>\
                                        <ion-nav-back-button>\
                                            <i class='ion-arrow-left-c'></i>\
                                        </ion-nav-back-button>\
                                        <ion-nav-buttons side='left'>\
                                            <button class='button button-icon button-clear ion-navicon' menu-toggle='left'></button>\
                                        </ion-nav-buttons>\
                                    </ion-nav-bar>\
                                    <ion-nav-view name='userView'/>",
                        controller: 'BabiesCtrl'
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
            })
            //.state(ShareBJ.state.babyNew, {
            //    url: '/new',
            //    views: {
            //        'userView': {
            //            templateUrl: 'sbj_babies_lib/client/new.ng.html',
            //            controller: 'NewBabyCtrl'
            //        }
            //    }
            //})
            .state(ShareBJ.state.babyEdit, {
                url: '/:babyId',
                views: {
                    'userView': {
                        templateUrl: 'sbj_babies_lib/client/new.ng.html',
                        controller: 'NewBabyCtrl'
                    }
                }
            });
    });