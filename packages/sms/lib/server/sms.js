SMSLog = new Mongo.Collection('SMSLog');

SMSProvider = class{
    constructor(){
/*
        if(new.target === 'SMSProvider'){
            throw new TypeError("Can not construct abstract SMSProvider instance directly");
        }
*/
        if(this.sendMessage === undefined){
            throw new TypeError("Must override sendMessage");
        }
        this._templateParameters = {
            'register':["code","minutes"],
            'password_reset':["code","minutes"],
            "mobile_confirm":["name","nickname","code","minutes"],
            'test':["no"]
        }
    }
}
var _error_no = 0;
class SMSManger{
    constructor(){
        this._providers = {};
        this._current = null;
        this._templates = {};
    }
    get isReady(){return !!this._current;}
    registerProvider(name, provider){
        check(name,String);
        //check(provider, Match.Where(()=>{ return provider instanceof SMSProvider }) );

        this._providers[name] = provider;
    }
    setProvider(provider){
        if(!this._providers[provider])
            throw new Error(`'${provider} is not registered yet`);

        this._current = this._providers[provider];
        console.log(`SMS provider set as ${provider}`);
    }
    sendMessage(template, mobile, options, callback){
        //console.log("current:",this,this._current);
        if(this.isReady){
            var provider = this._current;

            return this._current.sendMessage(template, mobile, options, Meteor.bindEnvironment(function(err,result){
                console.log(err,result);
                var date = new Date();
                if(err){
                    _error_no++;
                    SMSLog.insert({
                        _id:"err-"+Random.id(),
                        to: mobile,
                        status: err.message,
                        template:template,
                        option:options,
                        provider: provider.name,
                        createdAt: date,
                        updatedAt: date
                    });
                    callback && callback(err);
                }else
                {
                    SMSLog.insert({
                        _id: result.messageId.toString(),
                        to: mobile,
                        status: result.status,
                        template:template,
                        option:options,
                        provider: provider.name,
                        createdAt: date,
                        updatedAt: date
                    });
                    callback && callback(undefined,result);
                }
            }));
        }else{
            console.log('======BEGIN SMS ======');
            console.log("SMS not sent due to no SMS provider set, work as development mode!");
            console.log(mobile);
            console.log(template);
            console.log(options);
            const messageId = `fake${Random.id()}`;
            console.log(`messageId:${messageId}`)
            console.log('======END SMS ======');

            callback(null,messageId);
        }
    }
    queryStatus(messageId, callback){
        if(this._current)
            return this._current.queryMessageStatus(messageId,callback);
    }
};

SMSDeliver = new SMSManger();


Meteor.startup(()=>{
   if(Meteor.settings.sms && Meteor.settings.sms.provider){
       SMSDeliver.setProvider(Meteor.settings.sms.provider);
   }
   if(!SMSDeliver.isReady){
       console.log("Waring: no sms deliver provoder set! SMS messages will not be sent!");
   }
});
