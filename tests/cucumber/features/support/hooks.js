module.exports = function(){
    this.Before(function(){
        this.server.call('reset');
    })
}