angular.module('shareBJ.babies')
    .controller('InvitationCtrl',function($scope,$meteor,$rootScope,$stateParams,$ionicNavBarDelegate,$ionicPopup){
        //$meteor.autorun($scope,function(){
        //    //if($scope.search.confirm)
        //    console.log('search.confirm',$scope.getReactively('search.confirm'));
        //});

        $scope.search = {};

        var title = "邀请他人";
        switch ($stateParams.type){
            case 'guard':
                title += '监护';
                break;
            case 'follow':
                title += '关注';
                break;
        };
        if($rootScope.currentUser){
            $scope.$meteorSubscribe('myBabies').then(function(){
                $scope.baby = $scope.$meteorObject(Babies,$stateParams.babyId,false);

                title += '[' + $scope.baby.name + ']';
                $ionicNavBarDelegate.title(title);
            });
        }

        $scope.verifyStr = function(verified){
            return verified?'已验证':'未验证';
        };

        $scope.verified = false;
        $scope.queryTarget = function(){
            $scope.verified = false;
            $meteor.call('InviteFor',$scope.search.text,$stateParams.babyId).then(
                function(result){
                    $scope.verified = true;
                    $scope.queryResult = result;
                }
            );
        };

        $scope.invite = function(){
            var okReport = function(){
                $ionicPopup.alert({
                    title:"邀请",
                    template:'邀请已发送, 你可以继续邀请其它人！'
                });
                $scope.search.text = "";
                $scope.verified = false;
            };
            var errorReport =function(error){
                $ionicPopup.alert({
                    title:"邀请",
                    template:'邀请发送失败：' + error.message
                });
            };
            if($scope.verified && $scope.queryResult ){
                console.log($scope.queryResult);
                switch($scope.search.confirm){
                    case true:
                        if($scope.queryResult[1]==='unregistered'){
                            $meteor.call('Invite', $scope.queryResult[0], $scope.baby._id, $scope.queryResult[2], $stateParams.type).then(
                                okReport, errorReport
                            );
                        }else{
                            $meteor.call('Invite',$scope.queryResult[0]._id,$scope.baby._id,'user',$stateParams.type).then(
                                okReport,errorReport
                            );
                        }
                        break;
                    case 'registerUser':
                        $meteor.call('Invite',$scope.queryResult[0]._id,$scope.baby._id,'user',$stateParams.type).then(
                            okReport,errorReport
                        );
                        break;
                    case 'mobile':
                        $meteor.call('Invite',$scope.queryResult[0],$scope.baby._id,'mobile',$stateParams.type).then(
                            okReport,errorReport
                        );
                        break;
                    case 'email':
                        $meteor.call('Invite',$scope.queryResult[0],$scope.baby._id,'email',$stateParams.type).then(
                            okReport,errorReport
                        );
                        break;
                };
            }
        }

    });