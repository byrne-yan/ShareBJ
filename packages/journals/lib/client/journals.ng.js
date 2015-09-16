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

        $scope.closeSlides = function(){
            $scope.slideModal.hide();
            $scope.slideModal.remove();
        };

        $scope.showSlides = function(images,index){
            console.log('showSlides:',images)
            $scope.currentImages = images;
            $scope.slideStart = index;
            $scope.slideModal = $ionicModal.fromTemplate(
                '<sbj-slide-box images="currentImages" thumb="thumb" src="url" start="{{slideStart}}" onclose="closeSlides()"></sbj-slide-box>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            $scope.slideModal.show();
        };

        $scope.upvote = function(journal){
          $meteor.call('upvote',journal._id,Meteor.userId())
              .then(function(){

              },function(err){
                  console.log(err);
                  $scope.error.sbjError = {
                      sharebj:true,
                    sharebjErrorMessage: err.message
                  }
              })
        }
    });