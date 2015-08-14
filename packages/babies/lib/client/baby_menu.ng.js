function _calcAge(date){
    var today = new Date();
    var age = today.getFullYear() - date.getFullYear();
    var months = today.getMonth() - date.getMonth();
    var days = today.getDate() - date.getDate();
    if(days <0  )
    {
        months--;
    }

    if(months <0 || (months ===0 && days < 0 )){
        age--;
        months += 12;
    }
    if(age>0)
        return age + '岁';

    if(age<1){
        if(days===0)
            return months + '个月';
        return (months>0?months + '个月':"") + days + "天";
    }

}
function _calcWeeks(date) {
    var today = new Date();
    var d = parseInt((today.getTime() - date.getTime())/1000/60/60/24);
    var weeks = parseInt(d/7);
    var days =d%7
    if(days==0)
        return weeks + "周";
    return (weeks>0?(weeks + "周"):"") + days + "天";
}
angular.module('shareBJ.babies')
    .controller('BabiesMenuCtrl',function($scope,$meteor,$rootScope){
        $scope.babies = $scope.$meteorCollection(Babies).subscribe('myBabies');


        $meteor.subscribe('myRequests').then(function(){
            $scope.requestsCount = Counts.get('numOfMyRequests');
        });


        $scope.age = function(baby){
            if(baby.birth ){
                return _calcAge(baby.birth.birthTime);
            }else{
                return _calcWeeks(baby.conceptionDate);
            }
        };


    });
