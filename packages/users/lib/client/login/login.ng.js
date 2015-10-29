angular.module('shareBJ.users')
    .controller('LoginCtrl',function($scope,$meteor,$state,$ionicHistory,$timeout){

        $scope.user ={};

        Tracker.autorun(function(c){
            $scope.user.netError = null;
            if(!Meteor.status().connected){
                $scope.user.netError = { connect: true};
                $scope.user.netStatus = Meteor.status().status;
                $timeout(function(){},0,false);
            }
        });

        $scope.login = function(){
            $scope.user.loginError = {'login':false};
            Meteor.loginWithPasswordEx($scope.user.username,$scope.user.password,function(error){
                if(error){
                    $scope.user.loginError = {'login':true};
                    $scope.loginErrorMessage = error.message;
                    switch (error.reason) {
                        case "User not found":
                            $scope.loginErrorMessage = "该用户不存在，请重新输入用户名！";
                            break;
                        case "Incorrect password":
                            $scope.loginErrorMessage = "密码不正确，请重新输入密码！";
                            break;
                    }
                    console.log(error);
                }else{
                    //console.log("login ok, then go to home page");
                    //$scope.user.password="";
                    $state.go(ShareBJ.state.home);

                }
            });
        };
        $scope.loginWithQq = function(){
            Meteor.loginWithQq({
                loginStyle:'redirect',
                redirectUrl:Meteor.absoluteUrl('',{replaceLocalhost:true})
            },function(error,res){
                if(error){
                    $scope.user.loginError = {'login':true};
                    $scope.loginErrorMessage = error.message;
                    console.log(error);
                }else{
                    console.log("login ok ",res);
                    //$scope.user.password="";
                    $state.go(ShareBJ.state.home);
                }
            })
        };
        $scope.loginWithWechat = function(){
            Meteor.loginWithWechat({
                loginStyle:'redirect',
                redirectUrl:Meteor.absoluteUrl('',{replaceLocalhost:true})
            },function(error,res){
                if(error){
                    $scope.user.loginError = {'login':true};
                    $scope.loginErrorMessage = error.message;
                    console.log(error);
                }else{
                    console.log("login ok ",res);
                    //$scope.user.password="";
                    $state.go(ShareBJ.state.home);
                }
            })
        };
        $scope.loginWithWeibo = function(){
            Meteor.loginWithWeibo({
                loginStyle:'redirect',
                redirectUrl:Meteor.absoluteUrl('',{replaceLocalhost:true})
            },function(error,res){
                if(error){
                    $scope.user.loginError = {'login':true};
                    $scope.loginErrorMessage = error.message;
                    console.log(error);
                }else{
                    console.log("login ok ",res);
                    //$scope.user.password="";
                    $state.go(ShareBJ.state.home);
                }
            })
        }

    });