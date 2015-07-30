
ShareBJ.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        ShareBJ.stateRegisters.each(function(register){
            register($stateProvider);
        });
    }]);