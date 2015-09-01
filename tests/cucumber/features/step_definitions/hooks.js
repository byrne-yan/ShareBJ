(function(){
    'use strict';

    module.exports = function() {
        this.Before(function(){
            //console.log(this);
            return [
                this.server.call('fixtures/reset')
                //this.client.url(process.env.ROOT_URL)
                ];
        });
    };

})();
