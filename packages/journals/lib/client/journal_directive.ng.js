(function(){
    var directive = function() {

        return {
            restrict: 'E',
            scope: {
                target: '@',
                author: '=',
                journal: '=' //must have propeties: images,
            },
            replace: "true",
            templateUrl: "sbj_journals_lib/client/journal_directive.ng.html",
            controller: function ($scope, $meteor, $timeout, $ionicModal,$ionicPopover) {
                //console.log($scope.journal.babyDetail);
                $scope.error = {};
                $scope.edit = {};
                $ionicPopover.fromTemplateUrl('sbj_journals_lib/client/input_popover.ng.html',{scope:$scope,focusFirstInput:true})
                    .then(function(popover){
                        $scope.input = popover;
                        $scope.$on('$destroy',function(){
                            $scope.input.remove();
                        });
                    });



                $meteor.autorun($scope,function(){
                    $scope.timeFromNow = function(date){
                        if(date)
                        {
                            return moment(date).fromNow();
                        }
                    }
                });

                $scope.closeSlides = function(){
                    $scope.slideModal.hide();
                    $scope.slideModal.remove();
                };

                $scope.showSlides = function(images,index){
                    console.log('showSlides:',images)
                    $scope.currentImages = images;
                    $scope.slideStart = index;

                    $scope.slideModal = $ionicModal.fromTemplate(
                        '<sbj-slide-box images="currentImages" thumb="thumb" src="url" orientation-fix="true" start="{{slideStart}}" onclose="closeSlides()"></sbj-slide-box>', {
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
                    if($scope.input.isShown())
                        $scope.input.hide($event);
                    else
                        $scope.input.show($event);
                };
                $scope.comment = function(journal){
                    $meteor.call('commentOnJournal',journal._id,Meteor.userId(),$scope.edit.saying)
                        .then(function(){
                            //hide commnent box
                            $timeout(function(){
                                $scope.$apply(function(){
                                    $scope.edit.saying = '';
                                });
                            })
                            $scope.input.hide();
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