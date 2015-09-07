(function(){
    'use strict';

    module.exports = function() {
        this.Before(function(){
            //console.log("Before");
            this.server.call('fixtures/reset');
        });
    };

})();
