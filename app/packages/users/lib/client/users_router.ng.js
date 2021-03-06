if(!ShareBJ.menu)
    ShareBJ.menu = {};
ShareBJ.menu.userSummary = 'sbj_users_lib/client/user/user_summary.ng.html';

angular.module('shareBJ.users')
.config(  function($urlRouterProvider,$stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);
        ShareBJ.state.login = "login";
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
            .state('recoverPassword',{
                url:'/login/recover/password?userId&verify',
                templateUrl: 'sbj_users_lib/client/recover/recover_set_password.ng.html',
                controller: 'RecoverPasswordCtrl'
            })

            .state('recoverPhone',{
                url:'/login/recover/phone?userId&phone',
                templateUrl: 'sbj_users_lib/client/recover/recover_phone.ng.html',
                controller: 'RecoverVerifyCtrl'
            })
            .state('recoverEmail',{
                url:'/login/recover/email?userId&email',
                templateUrl: 'sbj_users_lib/client/recover/recover_email.ng.html',
                controller: 'RecoverVerifyCtrl'
            })
            .state('recoverConfirm',{
                url:'/login/recover/confirm',
                templateUrl: 'sbj_users_lib/client/recover/recover_select.ng.html',
                controller: 'RecoverConfirmCtrl',
                params:{
                    user:null
                }
            })
            .state('recover',{
                url:'/login/recover',
                templateUrl: 'sbj_users_lib/client/recover/recover.ng.html',
                controller: 'RecoverCtrl'
            })
            .state("login",{
                url:'/login',
                templateUrl: 'sbj_users_lib/client/login/login.ng.html',
                controller: 'LoginCtrl'
            })
            .state("changePassword",{
                url:'/users/current/changepwd',
                templateUrl: 'sbj_users_lib/client/user/user_change_password.ng.html',
                controller: 'ChangePasswordCtrl'
            })
            .state('signupByEmail',{
                url:'/signup_email?email&name',
                templateUrl: 'sbj_users_lib/client/signup/signup_with_email.ng.html',
                controller: 'SignupWithEmailCtrl'
            })
            .state('signupByPhone',{
                url:'/signup_phone?mobile&name',
                templateUrl: 'sbj_users_lib/client/signup/signup_with_phone.ng.html',
                controller: 'SignupWithPhoneCtrl'
            })
            .state('signup',{
                //cache:false,
                url:'/signup?token&mobile&email',
                templateUrl: 'sbj_users_lib/client/signup/signup.ng.html',
                controller: 'SignupCtrl'
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
        ;
    })
;