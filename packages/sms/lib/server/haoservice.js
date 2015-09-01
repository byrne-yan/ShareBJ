HaoService = function(){
    this.name = "haoservice";
    this._send_url ='http://apis.haoservice.com/sms/send';
    this._status_url = 'http://apis.haoservice.com/sms/getmessagestatus';
};


HaoService.prototype = {
    sendMessage: function(template, mobile, params, callback){
        var args = _.reduce(params,function(memo,value,key){
            var pair =  '#' + key + '#' + '=' + value
            return (memo===''?'':'&') + pair;
        },'');

        HTTP.post(this._send_url,{
            params:{
                key:Meteor.settings.haoservice.key,
                mobile:mobile,
                tpl_id:template,
                tpl_value:encodeURIComponent(args)
            }
        },function(error, result){
            if(error){
                //console.log("post error:",error);
                callback(error);
            }else{
                var sms = JSON.parse(result.content)
                if(sms.error_code !== 0 )
                {
                    //console.log(error_code[result.error_code]);
                    delete sms.result;
                    callback(sms);
                }else{
                    callback(null,sms.result.toString());
                }
            }
        });
    },
    queryMessageStatus: function(messageId,callback){
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

SMSDeliver.registerProvider('haoservice',new HaoService());