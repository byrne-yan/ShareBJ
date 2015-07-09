angular.module('shareBJ')
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider){

            $locationProvider.html5Mode(true);

            $stateProvider
                .state('journals', {
                    url: '/journals',
                    templateUrl: 'client/journals/views/journals-list.ng.html',
                    controller: 'JournalsListCtrl'
                })
            .state('photos',{
                    url:'/photos',
                    templateUrl:'client/photos/views/pick_images.ng.html' ,
                    controller:'LocalPhotosCtrl'
                })
            .state('newJournal',{
                url:'/journals/new',
                templateUrl:'client/journals/views/journal_new.ng.html' ,
                controller:'JournalCtrl'
            });
            $urlRouterProvider.otherwise('/journals');
        }]);
