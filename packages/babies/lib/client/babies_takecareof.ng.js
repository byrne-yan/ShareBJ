angular.module('shareBJ.babies')
    .controller('BabiesGuardianCtrl',function($scope,$meteor,$ionicPopup,$rootScope) {
        if($rootScope.currentUser)
        {
            $scope.$meteorSubscribe('myBabies');
        };

        $scope.babies = $scope.$meteorCollection(function(){
            return Babies.find({owners:$rootScope.currentUser._id});
        },false);

        $scope.cancelGuardian = function(baby,guardian){
            $meteor.call('CancelGuardian',baby._id,guardian._id).then(function(){

            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"取消监护",
                    template:'取消失败：' + error.message
                });
            })
        };
        $scope.cancelFollowing = function(baby,follower){
            $meteor.call('CancelFollowing',baby._id,follower._id).then(function(){

            },function(error){
                console.log(error);
                $ionicPopup.alert({
                    title:"取消关注",
                    template:'取消失败：' + error.message
                });
            })
        };
        $scope.isOwner = function(baby,guardian){
            return baby.owners[0] === guardian._id;
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