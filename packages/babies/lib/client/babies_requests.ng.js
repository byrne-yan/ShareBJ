angular.module('shareBJ.babies')
    .controller('BabiesRequestsCtrl',function($scope,$rootScope, $meteor,$state,$ionicPopup,$ionicNavBarDelegate) {

        if($rootScope.currentUser){
            $meteor.subscribe('myRequests');
        }

        $scope.requests = $scope.$meteorCollection(Requests,false);

        $ionicNavBarDelegate.showBar(false);
        $scope.action = function(request){
            return '于' + request.requestAt.toISOString().slice(0,10) + '向你申请宝宝'
        };
        $scope.effect = function(request){
            switch (request.type) {
                case 'guard':
                    return '的监护权限';
                case 'follow':
                    return '的关注权限';
            }
        };

        $scope.approve = function(request){
            $meteor.call('ApproveRequest',request._id).then(function(){
                if($scope.requests.length === 0){
                    $state.go(ShareBJ.state.home);
                }
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"批准请求",
                    template:'批准失败：' + error.message
                });
            })
        };
        $scope.reject = function(request){
            $meteor.call('RejectRequest',request._id).then(function(){
                if($scope.requests.length === 0){
                    $state.go(ShareBJ.state.home);
                }
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"拒绝请求",
                    template:'拒绝失败：' + error.message
                });
            })
        };

    });