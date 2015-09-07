angular.module('shareBJ.babies')
    .controller('BabiesMenuCtrl',function($scope,$meteor,$rootScope){

        if (Meteor.userId())
        {
            $scope.babies = $scope.$meteorCollection(Babies).subscribe('myBabies');
            $scope.$meteorSubscribe('myRequests')
                .then(function () {
                    $scope.requestsCount = $scope.$meteorObject(Counts,'numOfMyRequests',false);
                }, console.log);
        }

        //$scope.requests = $scope.$meteorCollection(Requests,false);
        //Tracker.autorun(function(){
        //    $scope.requestsCount =$scope.requests.length;
        //    console.log($scope.requestsCount);
        //});


        $scope.age = function(baby){
            if(baby.birth ){
                return ageOf(baby.birth.birthTime)[3];
            }else{
                return conceptionAge(baby.conceptionDate)[2];
            }
        };


    });
