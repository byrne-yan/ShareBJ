angular.module('shareBJ.users')
.config(  function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('users_login',{
                url:'/login',
                templateUrl: 'sbj_users_lib/client/login/login.ng.html',
                controller: 'LoginCtrl'
            })
            .state('users_signup',{
                cache:false,
                url:'/signup',
                templateUrl: 'sbj_users_lib/client/signup/signup.ng.html',
                controller: 'SignupCtrl'
            })
            .state('users_logout',{
                cache:false,
                url:'/logout',
                //resvole:{
                //    logouted: function($meteor){
                //        return $meteor.logout();
                //    }
                //},
                controller: function($scope, $state, $meteor){
                    $meteor.logout().then(function() {
                        $state.go('users_login');
                    },function(error){
                            console.log(error);
                    });
                }
            })
        ;
    });