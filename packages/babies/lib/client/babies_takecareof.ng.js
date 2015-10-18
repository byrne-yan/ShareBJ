angular.module('shareBJ.babies')
    .controller('BabiesGuardianCtrl',function($scope,$meteor,$ionicPopup,$rootScope,$timeout) {
        if($rootScope.currentUser)
        {
            $scope.$meteorSubscribe('myBabies');
        };

        $scope.babies = $scope.$meteorCollection(function(){
            $scope.getReactively('actionPerformed');
            $scope.actionPerformed = false;
            return Babies.find({owners:$rootScope.currentUser._id});
        },false);

        $scope.cancelGuardian = function(baby,guardian){

            $ionicPopup.confirm({
                title:'动作确认',
                template:'您正在试图收回'+ (guardian.profile.name||guardian.username)+'对宝宝【'+ baby.name + '】的监护权限。收回后对方将不再能够发布该宝宝的日记。您确认要收回吗？'
            }).then(function(res){
                if(res)//yes
                {
                    $meteor.call('CancelGuardian',baby._id,guardian._id).then(function(){
                        $scope.actionPerformed = true;
                        //update view
                        $timeout(function(){});
                    },function(error){
                        console.log(error);
                        $ionicPopup.alert({
                            title:"取消监护",
                            template:'取消失败：' + error.message
                        });
                    })
                }
            });

        };
        $scope.cancelFollowing = function(baby,follower){
            $ionicPopup.confirm({
                title:'动作确认',
                template:'您正在试图收回'+ (follower.profile.name||follower.username)+'对宝宝【'+ baby.name + '】的关注权限。收回后对方将不再能够阅读该宝宝的日记。您确认要收回吗？'
            }).then(function(res) {
                if (res)//yes
                {
                    $meteor.call('CancelFollowing', baby._id, follower._id).then(function () {
                        //trigger updating data
                        $scope.actionPerformed = true;
                        //update view
                        $timeout(function(){});
                    }, function (error) {
                        console.log(error);
                        $ionicPopup.alert({
                            title: "取消关注",
                            template: '取消失败：' + error.message
                        });
                    })
                }
            });
        };
        $scope.isOwner = function(baby,guardian){
            return guardian && baby.owners[0] === guardian._id;
        };
        $scope.age = function(baby){
            if(baby.birth)
            {
                var age = ageOf(baby.birth.birthTime);

                return age[3];
            }
        };
        $scope.conceptionAge = function(baby){
            if(!baby.birth)
            {
                var age = conceptionAge(baby.conceptionDate);
                return age[2];
            }
        };
        $scope.birthDate = function(baby){
            return moment(baby.birth.birthTime).format('YYYY年M月D日');
        };
        $scope.birthTime = function(baby){
            return  moment(baby.birth.birthTime).format('H:m');
        }
    });