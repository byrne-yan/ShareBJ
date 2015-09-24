SMSLog = new Mongo.Collection('SMSLog');

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
        console.log("SMS provider set as "+provider);
    },
    sendMessage: function(template, mobile, options, callback){
        if(this._current){
            var provider = this._current;

            return this._current.sendMessage(template, mobile, options, Meteor.bindEnvironment(function(err,result){
                console.log(err,result);
                if(err){
                    callback && callback(err);
                    return;
                }else
                {
                    var date = new Date();
                    SMSLog.insert({
                        _id: result.messageId,
                        to: mobile,
                        status: result.status,
                        template:template,
                        option:options,
                        provider: provider.name,
                        createdAt: date,
                        updatedAt: date
                    });
                    callback && callback(null,result);
                    //Meteor.setTimeout( Meteor.bindEnvironment(function(){
                    //    console.log("query "+result.messageId);
                    //    provider.queryMessageStatus(result.messageId,Meteor.bindEnvironment(function(err,status){
                    //        if(!err){
                    //            console.log("query result:"+status);
                    //            SMSLog.update({_id:result.messageId},{$set:{status:status,updatedAt:new Date()}});
                    //        }else{
                    //            console.log(err);
                    //        }
                    //    }))
                    //}),2000);
                }
            }));
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



