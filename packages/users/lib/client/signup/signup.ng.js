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
    .controller('SignupWithPhoneCtrl', function ($scope, $meteor, $state, $stateParams, $ionicHistory) {
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

        $scope.$meteorAutorun(function() {
            console.log('buttons status:', $scope.getReactively('codeRequestReady'), $scope.getReactively('signupReady'));
        });
        //

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
        $scope.codeButtonName = '请求验证码';

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
                        $scope.signupErrorMessage = error.message;
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
    });