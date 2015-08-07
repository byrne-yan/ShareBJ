angular.module('shareBJ.babies')
    .controller('NewBabyCtrl',function($rootScope,$scope,$state,$ionicHistory,$ionicModal,$meteor,$timeout, $ionicLoading,
    babiesSub) {
        $scope.babies = $scope.$meteorCollection(Babies);

        $scope.baby = {
            born:true,
            concaptionDate: new Date(),
            gender: '--请选择性别--',
            birthTime: new Date()
        };


        $scope.beforeNow =  (new　Date()).toISOString().slice(0,19);
        $scope.dateBeforeNow =  (new　Date()).toISOString().slice(0,10);

        $scope.newBaby = function(baby){
            $scope.newbabyError = {newbaby:false};
            if(!baby.name && !baby.nickname){
                $scope.newbabyError.newbaby = true;
                $scope.newbabyErrorMessage ="名字和昵称至少要有一个";
                return;
            };

            var babyObj = {
                name: baby.name,
                nickname:baby.nickname || baby.name,
                owners:[$rootScope.currentUser._id]
            };

            if(baby.born){

                _.extend(babyObj,{
                    birth:{
                        birthTime: baby.birthTime,
                        gender: baby.gender,
                        birthWeight: baby.weight,
                        birthHeight: baby.height
                    }
                });
            }else{
                _.extend(babyObj,{conceptionDate: baby.conceptionDate});
            }


            $scope.babies.save( babyObj )
                .then(function(){
                    $state.go(ShareBJ.state.NewJournal);
                },
                function(err){
                    $scope.newbabyError.newbaby = true;
                    $scope.newbabyErrorMessage = err.reason;
                    console.log(err);
                });
        }
    });