angular.module('shareBJ.babies')
    .controller('BabiesCtrl',function(){

    })
    .controller('NewBabyCtrl',function($rootScope,$scope,$state,$stateParams,$ionicHistory,$ionicModal,$meteor,$timeout, $ionicLoading,
    babiesSub) {
        $scope.newMode = $stateParams.babyId==='new';


        $scope.title = $scope.newMode?"添加宝宝":"修改宝宝信息";
        $scope.buttonName = $scope.newMode?"添加":"保存";

        $scope.baby = {};

        if($scope.newMode)
        {
            $scope.babies = $scope.$meteorCollection(Babies);
            $scope.baby.name = "";
            $scope.baby.nickname = "";
            $scope.baby.born = true;
            $scope.baby.gender = '--请选择性别--';
            $scope.baby.birthTime = null;
            $scope.baby.birthWeight = "";
            $scope.baby.birthHeight = "";
            $scope.baby.conceptionDate = null;
        }else{
            $scope.babies = $scope.$meteorCollection(function(){
                return Babies.find({_id:$stateParams.babyId});
            },false);

            if($scope.babies.length > 0 )
            {
                $scope.baby.name = $scope.babies[0].name;
                $scope.baby.nickname = $scope.babies[0].nickname;
                $scope.baby.born = $scope.babies[0].birth;
                if($scope.baby.born) {
                    $scope.baby.gender = $scope.babies[0].birth.gender;
                    $scope.baby.birthTime = $scope.babies[0].birth.birthTime;
                    $scope.baby.birthWeight = $scope.babies[0].birth.birthWeight;
                    $scope.baby.birthHeight = $scope.babies[0].birth.birthHeight;
                }else{
                    $scope.baby.conceptionDate = $scope.babies[0].conceptionDate;
                }
            }

            //if($scope.babies.count!==1){
            //    $scope.newbabyError.newbaby = true;
            //    $scope.newbabyErrorMessage ="无效宝宝ID,无法修改";
            //    return;
            //}

        }


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
                nickname:baby.nickname,
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
            if(!$scope.newMode){
                babyObj._id = $scope.babies[0]._id;
            }
            //if($scope.newMode){
            //    Babies.insert(babyObj,function(error,babyId){
            //        if(error){
            //            $scope.newbabyError.newbaby = true;
            //            $scope.newbabyErrorMessage = err.reason;
            //            console.log(err);
            //        }else{
            //
            //            $state.go(ShareBJ.state.home);
            //        }
            //    });
            //}else{
            //    Babies.update({_id:}babyObj,function(error,babyId){
            //        if(error){
            //            $scope.newbabyError.newbaby = true;
            //            $scope.newbabyErrorMessage = err.reason;
            //            console.log(err);
            //        }else{
            //
            //            $state.go(ShareBJ.state.home);
            //        }
            //    });
            //
            //}



            $scope.babies.save( babyObj )
                .then(function(){
                    $state.go(ShareBJ.state.home);
                },
                function(err){
                    $scope.newbabyError.newbaby = true;
                    $scope.newbabyErrorMessage = err.reason;
                    console.log(err);
                });
        }
    });
