ShareBJ.stateRegisters ={};

ShareBJ.stateRegisters.callbacks = [];

ShareBJ.stateRegisterss.register = function(callback)
{
    if(!_.isFunction(callback)){
        throwError('StateRegister must be a function.');
    }
    this.callbacks.push(callback);
}

ShareBJ.stateRegisters.each = function(callback)
{
    _.each(this.callbacks,function(iteratee){
        callback(iteratee);
    });
};
