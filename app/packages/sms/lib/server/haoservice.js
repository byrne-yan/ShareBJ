HaoService = class HaoService extends SMSProvider{
    constructor(){
        super();
        this.name = "haoservice";

        if(!Meteor.settings.haoservice) {
            throw new Error("haoservice missing in Meteor.settings");
        }
        if(!Meteor.settings.haoservice.key)
            throw new Error("haoservice key missing in Meteor.settings");
        this._key = Meteor.settings.haoservice.key;
        if(!Meteor.settings.haoservice.send_url)
            throw new Error("haoservice send_url missing in Meteor.settings");
        this._send_url = Meteor.settings.haoservice.send_url;
        if(!Meteor.settings.haoservice.status_url)
            throw new Error("haoservice status_url missing in Meteor.settings");
        this._status_url = Meteor.settings.haoservice.status_url;
        if(!Meteor.settings.haoservice.templates)
            throw new Error("haoservice templates missing in Meteor.settings");
        this._templates = Meteor.settings.haoservice.templates;

        //check if all templates supported
        let self = this;
        _.each(self._templateParameters,(parameters,key)=>{
            //console.log(key,parameters);
            if(self._templates[key]===undefined){
                throw new Error(`template '${key}' not supportted by haoservice provider`);
            }
            const missing = _.difference(parameters,self._templates[key].params);
            if(missing.length !== 0){
                throw new Error(`parameters '${missing}' not supported by template '${key}' in haoservice provider`);
            }
        })
    }

/*
 *
 *    @param {string} template - 'template:name'
 *
*/
    sendMessage(template, mobile, params, callback){
        check(template,String);
        //check(params, Match.OneOf([ Object, Match.Where( (f)=>_.isFunction(f) ) ]));
        if(!callback && _.isFunction(params))
            callback = params;

        let m = /^template:(.+)$/g.exec(template);

        if(m.length!==2 || this._templates[m[1]]==undefined )
            throw new TypeError(`unkown template ${m[1]}`);

        let template_name = m[1];

        let template_no = this._templates[template_name].id;
        let template_params = this._templates[template_name].params;//array


        const missing = _.difference(this._templateParameters [template_name],_.keys(params));
        if(missing.length !== 0){
            throw new Error(`parameters '${missing}' for template ${template_name}(${template_no}) missing`);
        }

        var args = _.reduce(params,function(memo,value,key){
            var pair =  '#' + key + '#' + '=' + value;
            return memo + (memo===''?'':'&') + pair;
        },'');


        HTTP.post(this._send_url,{
            params:{
                key:this._key,
                mobile:mobile,
                tpl_id:template_no,
                tpl_value:encodeURIComponent(args)
            }
        },function(error, result){
            if(error){
                callback(error);
            }else{
                var sms = JSON.parse(result.content);
                if(sms.error_code !== 0 )
                {
                    callback(new Error(`haoservice:${sms.error_code}:${sms.reason}`));
                }else{
                    callback(null,{messageId:sms.result});
                }
            }
        });
    }
    queryMessageStatus(messageId,callback){
        HTTP.post(this._status_url,{
            params:{
                key:Meteor.settings.haoservice.key,
                messageId: messageId
            }
        },function(error,result){
            if(error){
                callback(error);
            }else{
                var status = JSON.parse(result.content)
                if(status.error_code !== 0 )
                {
                    //console.log(error_code[result.error_code]);
                    delete status.result;
                    callback(status);
                }else{
                    callback(null,status.result);
                }
            }
        });
    }
};

if(Meteor.settings && Meteor.settings.haoservice)
    SMSDeliver.registerProvider('haoservice',new HaoService());