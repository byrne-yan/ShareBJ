Journals.feedStep= 10;

angular.module('shareBJ.journals')
    .controller('JournalsCtrl',function($scope,$meteor,babies){
        //$scope.page = 1;
        $scope.menu = {dragContent:true};

        $scope.numLoads = Journals.feedStep;
        $scope.filter = {};

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
                $scope.journalsCount = Counts.get('numOfMyJournals');
            });
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
            if($scope.numLoads < $scope.journalsCount)
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