Journals.feedStep= 10;

angular.module('shareBJ.journals')
    .controller('JournalsCtrl', function ($scope, $meteor, $stateParams, babies, $state, $ionicHistory) {
        if (babies.length === 0) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('shareBJ.babies.list');
        }
        $scope.numLoads = Journals.feedStep;
        $scope.filter = {};
        if($stateParams.baby)
            $scope.filter.baby = $stateParams.baby;

        $scope.babies = babies;
        $meteor.autorun($scope,function(){
            $meteor.subscribe('myJournals',{
                limit:parseInt($scope.getReactively('numLoads')),
                sort:{createdAt: -1}
            },
                {
                    baby: $scope.getReactively('filter.baby'),
                    search:$scope.getReactively('filter.search')
                }
            ).then(function(){
                $scope.journalsCount = $scope.$meteorObject(Counts,'numOfMyJournals',false);
            });

            $scope.timeFromNow = function(date){
                if(date)
                {
                    return moment(date).fromNow();
                }
            }
        });


        $scope.journals = $scope.$meteorCollection( function() {
                return Journals.find({},{
                    sort: {createdAt: -1}
                })
            },
            false
            );


        //$scope.selectedBabies = function(journal){
        //    if(!$scope.selectedBaby || $scope.selectdeBaby==='')
        //        return true;
        //    return journal.baby===$scope.selectedBaby;
        //};

        $scope.loadOlderJournals = function(){
            if($scope.numLoads < $scope.journalsCount.count)
            {
                console.log("loading older journals");
                $scope.numLoads = $scope.numLoads + Journals.feedStep;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.cancelSearch = function(){
            $scope.filter.search = "";
        }

    });