angular.module('shareBJ.babies')
    .controller('BabiesFollowCtrl',function($scope,$meteor,$ionicPopup,$rootScope,$timeout) {
        $scope.$meteorSubscribe('myFollowingBabies');

        $scope.babies = $scope.$meteorCollection(function(){
            return Babies.find({followers:$rootScope.currentUser._id});
        },false);

        $scope.cancelFollowing = function(baby){
            $ionicPopup.confirm({
                title:'动作确认',
                template:'您正在试图放弃对宝宝【'+ baby.name + '】的关注权限。放弃后您将不再能够阅读该宝宝的日记。您确认要放弃吗？'
            }).then(function(res){
                if(res)//yes
                {
                    $meteor.call('CancelFollowing',baby._id).then(function(){
                        $scope.actionPerformed = true;
                        //update view
                        $timeout(function(){});
                    },function(error){
                        console.log(error);
                        $ionicPopup.alert({
                            title:"放弃关注",
                            template:'放弃关注失败：' + error.message
                        });
                    })
                }
            });
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