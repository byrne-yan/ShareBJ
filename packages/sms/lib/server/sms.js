SMSManger = function(){
    this._providers = {};
    this._current = null;
    this._templates = {};
};
SMSManger.prototype = {
    registerProvider:function(name, provider){
        this._providers[name] = provider;
    },
    setProvider: function(provider){
        if(!this._providers[provider])
            throw 'unregistered provider:'+provider;

        this._current = this._providers[provider];
    },
    sendMessage: function(template, mobile, options, callback){
        if(this._current){
            var provider = this._current;

            return this._current.sendMessage(template, mobile, options,function(err,messageId){
                if(!err){//save mesage to collection
                    var date = new Date();
                    SMS.insert({
                        _id: messageId,
                        to: mobile,
                        status: 'queued',
                        provider: provider.name,
                        createdAt: date,
                        updatedAt: date
                    });
                }
                callback && callback(err,messageId);
                //2 seconds later, check if delivered

                Meteor.setTimeout( Meteor.bindEnvironment(function(){
                    provider.queryMessageStatus(messageId,Meteor.bindEnvironment(function(err,result){
                        if(!err){
                            SMS.update({_id:messageId},{$set:{status:result,updatedAt:new Date()}});
                        }
                    }))
                }),2000)
            });
        }else{
            console.log('======BEGIN SMS ======');
            console.log("SMS not sent due to no SMS provider set, work as development mode!");
            console.log(mobile);
            console.log(template);
            console.log(options);
            console.log('======END SMS ======');
            callback(null,"fake id");
        }
    },
    queryStatus: function(messageId, callback){
        if(this._current)
            return this._current.queryMessageStatus(messageId,callback);
    }
};

SMSDeliver = new SMSManger();

SMS = new Mongo.Collection('SMS');


