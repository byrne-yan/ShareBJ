angular.module('shareBJ.images')
    .config(function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('shareBJ.images',{
                abstract:true,
                url:'/images',
                views: {
                    'menuContent': {
                        templateUrl: 'sbj_images_lib/client/images_dashboard.ng.html',
                        controller: 'ImagesDashCtrl'
                    }
                }/*,
                resolve: {
                    'currentUser': function ($meteor) {
                        return $meteor.requireUser();
                    }
                }*/
            })
            .state('shareBJ.images.list', {
                url: '/list',
                views: {
                    'tab-images': {
                        templateUrl: 'sbj_images_lib/client/images_list.ng.html',
                        controller: 'ImagesListCtrl'
                    }
                }
            }).state('shareBJ.images.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'sbj_images_lib/client/images_settings.ng.html',
                        controller: 'ImagesSettingsCtrl'
                    }
                }
            }).state('shareBJ.images.uploads', {
                url: '/uploads',
                views: {
                    'tab-uploads': {
                        templateUrl: 'sbj_images_lib/client/uploading_dashboard.ng.html',
                        controller: 'UploadDashCtrl'
                    }
                }
            });
    })