angular.module('shareBJ.babies')
    .controller('BabiesCtrl',function(){})
    .controller('NewBabyCtrl',function($rootScope,$scope,$state,$stateParams,$ionicHistory,
                                       $ionicModal,$meteor,$timeout, $ionicLoading, babiesSub) {
        $scope.newMode = $stateParams.babyId==='new';


        $scope.title = $scope.newMode?"添加宝宝":"修改宝宝信息";
        $scope.buttonName = $scope.newMode?"添加":"保存";

        $scope.baby = {};

        if($scope.newMode)
        {
            $scope.babies = $scope.$meteorCollection(Babies);
            $scope.baby.avatar = null;
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
                $scope.baby.avatar = $scope.babies[0].avatar;
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
       }


        $scope.beforeNow =  (new　Date()).toISOString().slice(0,19);
        $scope.dateBeforeNow =  (new　Date()).toISOString().slice(0,10);

        function constructBabyObj(baby){
            if(!baby.name && !baby.nickname){
                $scope.newbabyError.newbaby = true;
                $scope.newbabyErrorMessage ="名字和昵称至少要有一个";
                return null;
            };

            var babyObj = {
                avatar: $scope.baby.avatar,
                name: baby.name,
                nickname:baby.nickname,
                owners:[$rootScope.currentUser._id],
                followers:[]
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
            return babyObj;
        }
        $scope.newBaby = function(baby){
            $ionicLoading.show({
                template:"正在保存宝宝信息...",
                hideOnStateChange:true,
                delay:100,
                duration:5000
            });
            $scope.newbabyError = {newbaby:false};

            var babyObj = constructBabyObj(baby);

            $scope.babies.save( babyObj )
            .then(function(){
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go(ShareBJ.state.home);
            },
            function(err){
                $ionicLoading.hide();
                $scope.newbabyError.newbaby = true;
                $scope.newbabyErrorMessage = err.message;
                console.log(err);
            });
        };

        $scope.editAvatar = function(){
            $scope.avatarModal = $ionicModal.fromTemplate(
                '<sbj-avatar save="saveAvatar"  onclose="closeAvatarEditor()"></sbj-avatar>',
                {
                    scope:$scope,
                    animation:'slide-in-up'
                }
            );
            $scope.avatarModal.show();
        };
        $scope.$on('$destroy',function(){
            if($scope.avatarModal)
                $scope.avatarModal.remove();
        });
        $scope.closeAvatarEditor =function(){
            $scope.avatarModal.hide();
            $scope.avatarModal.remove();
        };
        $scope.saveAvatar = function(dataURL){
            return new Promise(function(resolve,reject){
                $scope.baby.avatar = dataURL;
                $timeout(function(){ });
                resolve();
            });
        };


    });
