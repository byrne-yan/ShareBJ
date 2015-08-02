angular.module('shareBJ.journals')
    .controller('JournalsCtrl',function($scope,customData){
        $scope.data = customData.value;
        $scope.journals = [
            {desc:"sjdfdskdjhfg"},
            {desc:"lklffghlfgkhl;f"},
            {desc:"lklffghlfgkhl;f"},
            {desc:"lklffghlfgkhl;f"}
        ];
    });