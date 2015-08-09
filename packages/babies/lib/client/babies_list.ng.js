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
    .controller('BabiesListCtrl',function($scope,$rootScope){
    //$scope.babies = [
    //    {name:"芋头１",birthTime:new Date(2015,5,9,11,20)},
    //    {name:"芋头2",birthTime:new Date(2014,2,9,18,55)}
    //]
    //$scope.$meteorSubscribe('myBabies',$rootScope.currentUser._id).then(function(handle){
    //    $scope.babies = $scope.$meteorCollection(Babies);
    //});
    $scope.babies = $scope.$meteorCollection(Babies).subscribe('myBabies');
    $scope.age = function(baby){
        if(baby.birth ){
            return _calcAge(baby.birth.birthTime);
        }else{
            return _calcWeeks(baby.conceptionDate);
        }
    }
});
