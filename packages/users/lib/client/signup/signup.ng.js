

angular.module('shareBJ.users')
    .controller('SignupCtrl',function($scope,$meteor,$state,$stateParams,$location){
        $scope.user = {};
        if($stateParams.mobile){
            $scope.user.mobile = $stateParams.mobile;
        };
        if($stateParams.email){
            $scope.user.email = $stateParams.email;
        };

        $scope.signup = function(){

            $scope.user.signupError = {signup:false};
            $meteor.createUser({
                username: $scope.user.username,
                email: $scope.user.email,
                password: $scope.user.password,
                profile:{
                    name:$scope.user.name || $scope.user.username,
                    mobiles:[{
                        number:$scope.user.mobile,verified:false
                    }],
                    token: $stateParams.token?$stateParams.token:null
                }
            })
                .then(function(){
                    $state.go(ShareBJ.state.home);
                },
                function(error){
                    $scope.user.signupError = {signup:true};
                    $scope.signupErrorMessage = error.message;
                    switch (error.reason){
                        case "Username already exists.":
                            $scope.signupErrorMessage = "该用户名已经被使用，请换个用户名";
                            break;
                        case "Email already exists.":
                            $scope.signupErrorMessage = "该电子邮箱地址已经被使用，请换个电子邮箱地址";
                            break;

                    }
                    console.log(error);
                })
            }
    })
    .controller('SignupWithPhoneCtrl', function ($scope, $meteor, $state, $stateParams, $ionicHistory,$timeout) {
        $scope.user = {
            mobile:'',
            name:'',
            code:''
        };
        if($stateParams.mobile){
            $scope.user.mobile = $stateParams.mobile;
        };
        if($stateParams.name){
            $scope.user.name = $stateParams.name;
        };

        $scope.user.signupError = {signup:false};
        $scope.codeSent = false;

        $scope.$meteorAutorun(function(){
            $scope.codeRequestReady =
                !$scope.getReactively('codeSent')
                && !!$scope.getReactively('user',true).mobile
                && $scope.getReactively('user',true).mobile.length>0
                && !$scope.getReactively('user',true).signupError.signup;

            $scope.signupReady =
                !$scope.getReactively('user',true).signupError.signup
                && !!$scope.getReactively('user',true).code
                && $scope.getReactively('user',true).code.length>0;

        });
        //
        $scope.$meteorAutorun(function() {
            $scope.getReactively('user.mobile');
            $scope.user.signupError = {signup:false}
        });

        $scope.$meteorAutorun(function() {
            console.log('buttons status:', $scope.getReactively('codeRequestReady'), $scope.getReactively('signupReady'));
        });

        console.log('tag');
        //$meteor.session('CodeWindow').bind($scope,'codeWindow');
        Session.set("CodeWindow",0);

        $scope.$meteorAutorun(function() {
            $scope.codeButtonName = '请求验证码';
            if(Session.get("CodeWindow")){
                $scope.codeButtonName += '(' + Session.get("CodeWindow") + ')';
            }
            //console.log($scope.codeButtonName,Session.get("CodeWindow"));
            //console.log($scope.getReactively('codeSent'));
        });

        var cleanup = function () {
            Meteor.clearInterval(Session.get('CodeWindow'));
            Session.set('CodeWindow', 0);
            $scope.codeSent = false;
            $scope.user.code = "";
        };
        $scope.getCode = function() {
            console.log('start getCode');
            $scope.user.signupError = {signup:false};
            Accounts.requestPhoneVerification($scope.user.mobile, {name: $scope.user.name}, function (error) {
                    if (error) {
                        console.log(error);
                        $scope.user.signupError = {signup:true};

                        $scope.user.signupErrorMessage = (error.error>=500?'内部错误, 请联系管理员或客服。':'')+error.message;
                    } else {
                        console.log('get code done');
                        $scope.codeSent = true;
                        Session.set('CodeWindow', 30);
                        Session.set("timer", Meteor.setInterval(function () {
                            if (Session.get('CodeWindow'))
                                Session.set('CodeWindow', Session.get('CodeWindow') - 1);
                        }, 1000));
                        if (Session.get('CodeWindow') === 0) {
                            cleanup();
                        }
                    }
                $timeout(()=>{$scope.$apply(()=>{})});
            });
        };

        $scope.signup = function(){
            console.log('signup');
            $scope.user.signupError = {signup:false};
            Accounts.verifyPhone($scope.user.mobile,$scope.user.code,function(error){
                if(error){
                    console.log(error);
                    $scope.$apply(function() {
                        $scope.user.signupError = {signup: true};
                        $scope.user.signupErrorMessage = error.message;
                    })
                }else{
                    cleanup();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go(ShareBJ.state.home);
                }
            });
        }
    })
    .controller('SignupWithEmailCtrl', function ($scope, $meteor, $state, $stateParams, $ionicHistory,$timeout,$ionicLoading,$ionicPopup) {
        $scope.user = {
            email:'',
            email2:'',
            name:'',
            code:''
        };
        if($stateParams.email){
            $scope.user.email = $stateParams.email;
        };
        if($stateParams.name){
            $scope.user.name = $stateParams.name;
        };

        $scope.user.signupError = null;

        $scope.$meteorAutorun(function(){
            $scope.codeRequestReady =
                !$scope.getReactively('codeSent')
                && !!$scope.getReactively('user',true).email
                && $scope.getReactively('user',true).email.length>0
                && !$scope.getReactively('user',true).signupError;

            $scope.signupReady = $scope.getReactively('user.code')
                    && $scope.getReactively('user.code').length>0
                    && !$scope.getReactively('user',true).signupError;

            $timeout(()=>{$scope.$apply(()=>{})});
        });
        //
        $scope.$meteorAutorun(function() {
            $scope.getReactively('user.email');
            $scope.user.signupError = null;
            $scope.codeSent = false;
            $scope.user.code = "";
            $timeout(()=>{$scope.$apply(()=>{})});
        });
        $scope.$meteorAutorun(function() {
            $scope.codeButtonName = '请求验证码';
            if(Session.get("CodeWindow")){
                $scope.codeButtonName += '(' + Session.get("CodeWindow") + ')';
            }
            $timeout(()=>{$scope.$apply(()=>{})});
        });

        $scope.getCode = function() {
            $ionicLoading.show();
            Meteor.call('signup/createUserByEmail',$scope.user.email,$scope.user.name,function(error,userId){
                $ionicLoading.hide();
                if(error){
                    console.log(error);
                    $scope.$apply(function() {
                        $scope.user.signupError = {signup: true};
                        $scope.user.signupErrorMessage = error.message;
                    });
                }else{
                    $scope.codeSent = true;
                    Session.set('CodeWindow', 60);
                    Session.set("timer", Meteor.setInterval(function () {
                        if (Session.get('CodeWindow'))
                            Session.set('CodeWindow', Session.get('CodeWindow') - 1);
                    }, 1000));

                }
            })
        }
        var cleanup = function () {
            Meteor.clearInterval(Session.get('CodeWindow'));
            Session.set('CodeWindow', 0);
            $scope.codeSent = false;
            $scope.user.code = "";
        };
        $scope.signup = function(){
            $scope.user.signupError = {signup:false};
            Accounts.callLoginMethod({
                methodName     : 'signup/verifyEmail',
                methodArguments: [$scope.user.email,$scope.user.code],
                userCallback   :   function(error){
                    if(error){
                        console.log(error);
                        $scope.$apply(function() {
                            $scope.user.signupError = {signup: true};
                            $scope.user.signupErrorMessage = error.message;
                        })
                    }else{
                        cleanup();
                        //
                        $ionicPopup.alert({
                            title:'注册结果',
                            template:'您已完成注册，初始密码已发送到您的电子邮箱, 请前往邮箱查收！'
                        }).then((res)=>{
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go(ShareBJ.state.home);
                        })
                    }
                }
            });
        }
    });