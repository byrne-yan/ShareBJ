angular.module('shareBJ.babies')
    .controller('BabiesListCtrl', function ($scope, $rootScope, $meteor, $ionicModal, $ionicPopup/*,$ionicNavBarDelegate,$ionicHistory*/) {
        //$ionicHistory.clearHistory();
        //$ionicNavBarDelegate.showBackButton(false);
        $scope.numLoads = 10;
        $scope.filter = {search: ''};


        $scope.$meteorAutorun(function () {
            $scope.$meteorSubscribe('allBabies', {
                    limit:parseInt($scope.getReactively('numLoads'))
                },
                {
                    search:$scope.getReactively('filter.search')
                }
            ).then(function(){
                    $scope.babiesCount = Counts.get('numOfAllBabies');
                    $scope.babies = $scope.$meteorCollection(function () {
                            var filter = $scope.getReactively('filter.search')
                            var selector = {
                                $or: [
                                    {'name': {'$regex': '.*' + filter + '.*', '$options': 'i'}},
                                    {nickname: {'$regex': '.*' + filter + '.*', '$options': 'i'}}
                                ]
                            };
                            return Babies.find(selector, {
                                transform: function (doc) {
                                    if (doc.owners)
                                        Meteor.subscribe('getUser', doc.owners);
                                    return doc;
                                }
                            });
                        },
                        false
                    );
                }, console.log);
            console.log("filter:", $scope.getReactively('filter.search'));
            console.log("$scope.babiesCount", $scope.getReactively('babiesCount'));
        });
        if($rootScope.currentUser) {
            $scope.$meteorSubscribe('myRequests')
                .catch(console.log);
        }


        $scope.requests = $scope.$meteorCollection(Requests,false);

        $scope.userName = function(owner){
            var user = Meteor.users.findOne({_id:owner});
            if(user)
                return user.profile.name || user.username;
        };

        var accessor = new Baby();

        $scope.isGuardian = function(baby){
            return  accessor.isGuardian.call(baby,$rootScope.currentUser._id);
        };
        $scope.isGuardianOrRequested = function(baby){
            return  accessor.isGuardian.call(baby,$rootScope.currentUser._id) ||
                undefined != _.find($scope.requests,function(req){
                    return req.baby === baby._id && req.requester === $rootScope.currentUser._id && req.type=='guard'
                });
        };

        $scope.isGuardianOrFollowerOrRequested = function(baby){
            return  accessor.isGuardianOrFollower.call(baby,$rootScope.currentUser._id) ||
                undefined != _.find($scope.requests,function(req){
                    return req.baby === baby._id && req.requester === $rootScope.currentUser._id
                });
        };
        $scope.isRequestedGuardian = function(baby){
            return  undefined != _.find($scope.requests,function(req){
                return req.baby === baby._id && req.requester === $rootScope.currentUser._id && req.type=='guard'
            });
        };
        $scope.isFollow = function(baby){
            return  accessor.isFollower.call(baby,$rootScope.currentUser._id);
        };


        $scope.isGuardianOrFollowOrRequested = function(baby){
            return  accessor.isGuardianOrFollower.call(baby,$rootScope.currentUser._id) ||
                undefined != _.find($scope.requests,function(req){
                    return req.baby === baby._id && req.requester === $rootScope.currentUser._id
                });
        };
        $scope.isRequestedFollow = function(baby){
            return  undefined != _.find($scope.requests,function(req){
                return req.baby === baby._id && req.requester === $rootScope.currentUser._id && req.type==='follow'
            });
        };


        $scope.requestGuardian = function(baby){
            $meteor.call('RequestGuardian',baby._id).then(function(){
                $ionicPopup.alert({
                    title:"请求监护",
                    template:'监护请求已发送，等待现有监护人批准'
                })
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"请求监护",
                    template:'请求失败：' + error.message
                }).then(function(){
                })
            });
        };
        $scope.requestFollowing = function(baby){

            $meteor.call('RequestFollowing',baby._id).then(function(){
                $ionicPopup.alert({
                    title:"请求关注",
                    template:'关注请求已发送，等待监护人批准'
                })
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"请求关注",
                    template:'请求失败:' + error.message
                }).then(function(){
                })
            });
        };
        $scope.cancelRequestFollowing = function(baby){
            $meteor.call('CancelRequestFollowing',baby._id).then(function(){
                $ionicPopup.alert({
                    title:"撤回关注请求",
                    template:'关注请求已撤回'
                })
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"撤回关注请求",
                    template:'撤回关注请求失败：' + error.message
                }).then(function(){
                })
            });
        };
        $scope.cancelFollowing = function(baby){
            $meteor.call('CancelFollowing',baby._id).then(function(){
                $ionicPopup.alert({
                    title:"取消关注",
                    template:'关注已取消'
                })
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"取消关注",
                    template:'取消关注失败：' + error.message
                }).then(function(){
                })
            });
        };
        $scope.cancelRequestGuardian = function(baby){
            $meteor.call('CancelRequestGuardian',baby._id).then(function(){
                $ionicPopup.alert({
                    title:"撤回监护请求",
                    template:'监护请求已撤回'
                })
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"撤回监护请求",
                    template:'撤回监护请求失败：' + error.message
                }).then(function(){
                })
            });
        };
        $scope.cancelGuardian = function(baby){
            $meteor.call('CancelGuardian',baby._id).then(function(){
                $ionicPopup.alert({
                    title:"取消监护",
                    template:'监护已取消'
                })
            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"取消监护",
                    template:'取消监护失败：' + error.message
                }).then(function(){
                })
            });
        };

        //$scope.age = function(baby){
        //    if(baby.birth ){
        //        return _calcAge(baby.birth.birthTime);
        //    }else{
        //        return _calcWeeks(baby.conceptionDate);
        //    }
        //}
});
