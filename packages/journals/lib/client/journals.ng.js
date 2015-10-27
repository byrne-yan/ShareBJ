Journals.feedStep= 10;

angular.module('shareBJ.journals')
    .controller('JournalsCtrl', function ($scope, $meteor, $stateParams, babies, $state, $ionicHistory,$ionicModal) {
        $scope.error = {};

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

        //$scope.$meteorAutorun(function(){
        //    if($scope.getReactively('journals',true))
        //        console.timeEnd('shareBJ.journals.list');
        //});

        $scope.journals = $meteor.collection( function() {
                    return Journals.find({},{
                    sort: {createdAt: -1}/*,
                    transform: cacheTransform*/
                })
            },
            false
        );

        function cacheTransform(journal){
            _.each(journal.iamges,function(iamge){
               Images.cacheManager.cache(image.origin,function(cachedURI){
                   image.origin = cachedURI;
               })
            });
            return journal;
        }

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
        };

        $scope.newJournal = function () {
            console.log("params", $scope.filter, babies.length);
            console.log("params", $scope.filter, babies);
            if ($scope.filter.baby) {
                //current baby
                $state.go("shareBJ.journals.new", {baby: $scope.filter.baby});
            } else if (babies.length > 0) {
                //default first baby

                $state.go("shareBJ.journals.new", {baby: babies[0]._id});
            } else {
                //go to add a baby
                $state.go("shareBJ.babies.list");
            }
        };
    });