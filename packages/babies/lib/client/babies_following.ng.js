angular.module('shareBJ.babies')
    .controller('BabiesFollowCtrl',function($scope,$meteor,$ionicPopup,$rootScope) {
        $scope.$meteorSubscribe('myFollowingBabies');

        $scope.babies = $scope.$meteorCollection(function(){
            return Babies.find({followers:$rootScope.currentUser._id});
        },false);

        $scope.cancelFollowing = function(baby){
            $meteor.call('CancelFollowing',baby._id).then(function(){

            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"取消关注",
                    template:'取消失败：' + error.message
                });
            })
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