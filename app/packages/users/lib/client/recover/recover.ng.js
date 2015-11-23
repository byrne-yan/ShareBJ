angular.module('shareBJ.users')
    .controller('RecoverCtrl',function($scope,$meteor,$state,$ionicHistory,$timeout) {
        $scope.input = {};
        $scope.error = {sbjError:{}};

        $scope.searchAccount = function(){
            $meteor.call('searchAccount',$scope.input.identity)
                .then(function(user){
                    console.log('user:',user);
                    $state.go('recoverConfirm',{
                        user:user
                    });
                },function(err){
                    console.log(err);
                    $scope.error.sbjError.sharebj = true;
                    $scope.error.sbjError.sharebjErrorMessage = "账号不存在，请重新输入正确信息";
                })
        };
        $scope.back = function(){
            if($ionicHistory.backView())
                $ionicHistory.goBack();
            else
                $state.go('login');
        }

    })
    .controller('RecoverConfirmCtrl',function($scope,$meteor,$state,$stateParams,$ionicLoading) {
        $scope.user = $stateParams.user || {};
        $scope.mode = {};
        $scope.error ={sbjError: {}};

        if($scope.user.phone)
            $scope.mode.value = 'phone';
        else if($scope.user.emails)
            $scope.mode.value = 'email';
        $scope.next = function(){
            $ionicLoading.show({template:"等待发送中..."});
            switch($scope.mode.value){
                case 'phone':
                    $meteor.call('sendResetSMSVerify',$scope.user._id)
                        .then(function(){
                            $ionicLoading.hide();
                            $state.go('recoverPhone',{userId:$scope.user._id,phone:$scope.user.phone.number});
                        },function(err){
                            $ionicLoading.hide();
                            console.log(err);
                            $scope.error.sbjError.sharebj = true;
                            $scope.error.sbjError.sharebjErrorMessage = err.message;
                        });
                    break;
                case 'email':
                    $meteor.call('sendResetEmailVerify',$scope.user._id)
                        .then(function(){
                            $ionicLoading.hide();
                            $state.go('recoverEmail',{userId:$scope.user._id,email:$scope.user.emails[0].address})
                        },function(err){
                            $ionicLoading.hide();
                            console.log(err);
                            $scope.error.sbjError.sharebj = true;
                            $scope.error.sbjError.sharebjErrorMessage = err.message;
                        });
                    break;
            }
        };
    })
    .controller('RecoverVerifyCtrl',function($scope,$meteor,$state,$stateParams,$ionicLoading) {
        $scope.error = {sbjError : {}};
        $scope.input = {verifycode:''};
        $scope.phone = $stateParams.phone || '';
        $scope.email = $stateParams.email || '';
        $scope.next = function(){
            $ionicLoading.show({template:"验证中..."});
            $meteor.call('validateResetVerify',$stateParams.userId,$scope.input.verifycode)
                .then(function(){
                    $ionicLoading.hide();
                    $state.go('recoverPassword',{userId:$stateParams.userId,verify:$scope.input.verifycode});
                },function(err){
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.error.sbjError.sharebj = true;
                    $scope.error.sbjError.sharebjErrorMessage = err.message;
                })
        };
    })
    .controller('RecoverPasswordCtrl',function($scope,$meteor,$state,$stateParams,$ionicHistory) {
        $scope.error = {sbjError : {}};
        $scope.input={
            password1:'',
            password2:''
        };

        $scope.setPassword = function(){
            $meteor.call('setMyPassword',$stateParams.userId,$stateParams.verify,$scope.input.password1)
                .then(function(){
                    console.log("set password done");
                    $state.go('login');
                },function(err){
                    console.log(err);
                    $scope.error.sbjError.sharebj = true;
                    $scope.error.sbjError.sharebjErrorMessage = err.message;
                })
        };
    })
;