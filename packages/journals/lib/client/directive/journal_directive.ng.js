(function(){
    var directive = function() {

        return {
            restrict: 'E',
            scope: {
                //target: '@',
                //author: '=',
                journal: '=' //must have propeties: images,
            },
            replace: "true",
            templateUrl: "sbj_journals_lib/client/directive/journal_directive.ng.html",
            //link:function(scope,element,attrs){
            //
            //},
            controller: function ($scope, $meteor, $timeout, $ionicModal,$ionicPopover) {
                //console.log($scope.journal.babyDetail);
                $scope.error = {};
                $scope.edit = {};
                $scope.commenting = false;

                $meteor.autorun($scope,function(){
                    $scope.timeFromNow = function(date){
                        if(date)
                        {
                            return moment(date).fromNow();
                        }
                    }
                });
                $scope.age = $scope.journal.baby.birth?
                        ageOf($scope.journal.baby.birth.birthTime,$scope.journal.when||$scope.journal.createdAt)[3]
                        :conceptionAge($scope.journal.baby.conceptionDate,$scope.journal.when||$scope.journal.createdAt)[2];


                $scope.closeSlides = function(){
                    $scope.slideModal.hide();
                    $scope.slideModal.remove();
                };

                $scope.showSlides = function(images,index){
                    //console.log('showSlides:',images)
                    $scope.currentImages = images;
                    $scope.slideStart = index;

                    $scope.slideModal = $ionicModal.fromTemplate(
                        '<sbj-slide-box images="currentImages" thumb="thumb" src="url" orientation="orientation" start="{{slideStart}}" onclose="closeSlides()"></sbj-slide-box>', {
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
                };
                $scope.toggleComment = function($event){
                    $scope.commenting = !$scope.commenting;
                };

                $scope.comment = function(journal){
                    $meteor.call('commentOnJournal',journal._id,Meteor.userId(),$scope.edit.saying)
                        .then(function(){
                            //hide commnent box
                            $scope.edit.saying = '';
                            $scope.commenting = false;
                            $timeout(function(){ });
                        },function(err){
                            console.log(err);
                            $scope.error.sbjError = {
                                sharebj:true,
                                sharebjErrorMessage: err.message
                            }
                        })
                }
            }
        };
    };
    angular.module('shareBJ.journals')
        .directive("sbjJournal", directive);
}());