Journals.feedStep= 10;

angular.module('shareBJ.journals')
    .controller('JournalsCtrl', function ($scope, $meteor, $stateParams, babies, $state, $ionicHistory,$ionicModal) {
        $scope.error = {};

        $scope.filter = {};
        if (babies.length === 0) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('shareBJ.babies.list');
        }
        if (babies.length === 1) {
            $scope.filter.baby = babies[0]._id;
        }
        $scope.numLoads = Journals.feedStep;
        if($stateParams.baby)
            $scope.filter.baby = $stateParams.baby;

        $scope.babies = babies;
        $scope.filter.sortByPublish = false;
        $scope.sortMode = {when: -1};
        $meteor.autorun($scope,function(){

            if($scope.getReactively('filter.sortByPublish'))
                $scope.sortMode = {createdAt: -1};
            else
                $scope.sortMode = {when: -1};
            $meteor.subscribe('myViewableJournals',{
                limit:parseInt($scope.getReactively('numLoads')),
                sort: $scope.sortMode
            },
                {
                    baby: $scope.getReactively('filter.baby'),
                    search:$scope.getReactively('filter.search')
                }
            ).then(function(){
                $scope.journalsCount = $scope.$meteorObject(Counts,'numOfMyViewableJournals',false).count;
                //console.log('total count:',$scope.journalsCount);
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
        $scope.$meteorAutorun(function() {
            $scope.journals = $meteor.collection(function () {
                    return Journals.find({}, {
                        sort: $scope.getReactively('sortMode')/*,
                         transform: cacheTransform*/
                    })
                },
                false
            );
        });

        function cacheTransform(journal){
            _.each(journal.iamges,function(iamge){
               Images.cacheManager.cache(image.origin,function(cachedURI){
                   image.origin = cachedURI;
               })
            });
            return journal;
        }

        $scope.loadOlderJournals = function(){
            if($scope.numLoads < $scope.journalsCount)
            {
                $scope.numLoads += Journals.feedStep;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.cancelSearch = function(){
            $scope.filter.search = "";
        };

        $scope.newJournal = function () {
            //console.log("params", $scope.filter, babies.length);
            //console.log("params", $scope.filter, babies);
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