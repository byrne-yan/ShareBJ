if(!ShareBJ.menu)
    ShareBJ.menu = {};
ShareBJ.menu.userSummary = 'sbj_users_lib/client/user/user_summary.ng.html';

angular.module('shareBJ.users')
.config(  function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        ShareBJ.state.login = "shareBJ.users.login";
        ShareBJ.state.signup = "shareBJ.users.signup";
        ShareBJ.state.user = 'shareBJ.users.edit';
        ShareBJ.state.mobileVerify = 'shareBJ.users_edit.mobileVerify';
        $stateProvider
            .state('shareBJ.users',{
                url: '/users',
                views:{
                    'menuContent':{
                        templateUrl: "sbj_users_lib/client/users_main.ng.html",
                        controller: function($scope){}
                    }
                }
            })
            .state(ShareBJ.state.login,{
                url:'/login',
                views:{
                    'userView':{
                        templateUrl: 'sbj_users_lib/client/login/login.ng.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('shareBJ.users.signupByPhone',{
                //cache:false,
                url:'/signup_phone?mobile&name',
                views:{
                    'userView':{
                        templateUrl: 'sbj_users_lib/client/signup/signup_with_phone.ng.html',
                        controller: 'SignupWithPhoneCtrl'
                    }
                }
            })
            .state(ShareBJ.state.signup,{
                //cache:false,
                url:'/signup?token&mobile&email',
                views:{
                    'userView':{
                        templateUrl: 'sbj_users_lib/client/signup/signup.ng.html',
                        controller: 'SignupCtrl'
                    }
                }
            })
            .state(ShareBJ.state.user ,{
                //cache:false,
                url:'/current',
                views:{
                    'userView':{
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
            .state('shareBJ.users.edit.mobile' ,{
                //cache:false,
                url:'/mobile',
                views:{
                    'userView':{
                        templateUrl:'sbj_users_lib/client/user/mobile/mobile_edit.ng.html',
                        controller:'MobileEditCtrl'
                    }
                }
            })
            .state('shareBJ.users.notifications' ,{
                //cache:false,
                url:'/notifications',
                views:{
                    'userView':{
                        templateUrl:'sbj_users_lib/client/user/notifications.ng.html',
                        controller:'NotificationsCtrl'
                    }
                },
                resolve:{
                    "currentUser": function($meteor){
                        return $meteor.requireUser();
                    }
                }
            })
            //.state('verifyEmail',{
            //    url:'/#/verify-email/:token',
            //    templateUrl: 'sbj_users_lib/client/user/email.ng.html',
            //    contorller:'EmailVerifyCtrl'
            //})
            //
            //.state('shareBJ.users.mobile',{
            //    //cache:false,
            //    url:'/verify_mobile/:token',
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