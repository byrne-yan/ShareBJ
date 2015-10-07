angular.module('shareBJ.images')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('shareBJ.uploadDashboard', {
                url: '/uploads',
                views: {
                    'menuContent': {
                        templateUrl: 'sbj_images_lib/client/uploading_dashboard.ng.html',
                        controller: 'UploadDashCtrl'
                    }
                },
                resolve: {
                    'currentUser': function ($meteor) {
                        return $meteor.requireUser();
                    }
                }
            });
    })