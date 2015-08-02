angular.module('shareBJ.users')
.config(  function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        ShareBJ.state.login = "shareBJ.users_login";
        ShareBJ.state.signup = "shareBJ.users_signup";
        ShareBJ.state.user = 'shareBJ.users_edit';
        ShareBJ.state.mobileVerify = 'shareBJ.users_edit.mobileVerify';
        $stateProvider
            .state(ShareBJ.state.login,{
                url:'/login',
                views:{
                    'menuContent':{
                        templateUrl: 'sbj_users_lib/client/login/login.ng.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state(ShareBJ.state.signup,{
                //cache:false,
                url:'/signup',
                views:{
                    'menuContent':{
                        templateUrl: 'sbj_users_lib/client/signup/signup.ng.html',
                        controller: 'SignupCtrl'
                    }
                }
            })
            .state(ShareBJ.state.user ,{
                //cache:false,
                url:'/users/current',
                views:{
                    'menuContent':{
                        templateUrl:'sbj_users_lib/client/user/user.ng.html',
                        controller:'UserCtrl'
                    }
                },
                resolve:{
                    "currentUser": function($meteor){
                        return $meteor.requireUser();
                    }
                }
            })
            .state('verifyEmail',{
                url:'/#/verify-email/:token',
                templateUrl: 'sbj_users_lib/client/user/email.ng.html',
                contorller:'EmailVerifyCtrl'
            })

            //.state(ShareBJ.state.mobileVerify ,{
            //    //cache:false,
            //    url:'mobile_verify',
            //    views:{
            //        'menuContent':{
            //            templateUrl:'sbj_users_lib/client/user/user.ng.html',
            //            controller:'UserCtrl'
            //        }
            //    }
            //})
        ;
    })
;