describe('sms-integration',function(){
    'use strict';

    beforeAll(function(){
        //SMSDeliver.registerProvider('twilio',TwilioProvider);

    });

    beforeEach(function(){
        //mock(global,'Twilio');
        //console.log("registerProvider",SMSDeliver._providers);

    });

    it('should import twilio node',function(){
        expect(Twilio).toBeDefined();
    });

    it('should register twilio provider',function(){
        expect(SMSDeliver._providers['twilio']).toBeDefined();
    });

    it('should register haoservice provider',function(){
        expect(SMSDeliver._providers['haoservice']).toBeDefined();
    });


    describe('twilio-send',function(){
        beforeAll(function(){
            SMSDeliver.setProvider('twilio');
        });

        it('should has a name',function(){
           expect(SMSDeliver._current.name).toEqual('twilio');
        });

        it('can send a message to a mobile',function(done){
            var random_sid = Random.id();
            spyOn(SMSDeliver._providers['twilio']._twilioClient,'sendMessage').and.callFake(function(params,callback){

                Meteor.setTimeout(function(){
                    callback(null,{
                        sid:random_sid,
                        from:Meteor.settings.twilio.number,
                        to:'+8618612345678',
                        body:'[ShareBJ]这是一封测试短信',
                        date_created: new Date(),
                        direction:'outbound-api',
                        status:"queued"
                    });
                },500)
            });

            var callback =  function(err,messageId){
                expect(err).toBeNull();
                expect(messageId).toEqual(random_sid);
                done();
            };

            SMSDeliver.sendMessage('[ShareBJ]这是一封测试短信',
                '18612345678',
                {},//unused
                Meteor.bindEnvironment(callback)
            );

            expect(SMSDeliver._providers['twilio']._twilioClient.sendMessage).toHaveBeenCalledWith({
                    body:'[ShareBJ]这是一封测试短信',
                    to:'+8618612345678',
                    from: Meteor.settings.twilio.number
                },
                jasmine.any(Function)
            );
        });

        xit('can send a message to a verified mobile',function(done){
            var callback =  function(err,sms){
                expect(err).toBeNull();
                console.log(sms);
                expect(sms.status).toEqual('queued');
                done();
            };

            SMSDeliver.sendMessage('[ShareBJ]这是一封测试短信 http://sharebj.hy-studio.cn',
                '15013826020',
                {},//unused
                Meteor.bindEnvironment(callback)
            );
        });
    });

    describe('haoservice-send',function(){
        beforeAll(function(){
            SMSDeliver.setProvider('haoservice');
        });

        it('should has a name',function(){
            expect(SMSDeliver._current.name).toEqual('haoservice');
        });


        it('can send a message to a mobile', function(done){
            var random_sid = Math.floor(Random.fraction()*1000000);
            spyOn(HTTP, 'post').and.callFake(function(url,params,callback){
                Meteor.setTimeout(function(){
                    callback(null,{
                        statusCode:200,
                        content:'{"error_code":0,"reason":"成功","result":'+random_sid+'}'
                    });
                },500);
            });
            var callback =function(err,result){
                expect(err).toBeNull();
                expect(result).toEqual(random_sid.toString());
                done();
            };


            SMSDeliver.sendMessage(
                1,
                '18612345678',
                {
                    'no':343455
                },
                Meteor.bindEnvironment(callback)
            );
            expect(HTTP.post).toHaveBeenCalledWith(
                'http://apis.haoservice.com/sms/send',
                {
                    params:{
                        key:Meteor.settings.haoservice.key,
                        mobile:'18612345678',
                        tpl_id:1,
                        tpl_value:'%23no%23%3D343455'
                    }
                },
                jasmine.any(Function)
                //cb
            );
        });

        xit('can send a real message to a mobile', function(done){
            var callback =function(err,result){
                console.log(err,result);
                expect(err).toBeNull();
                expect(result).toBeDefined();
                done();
            };

            SMSDeliver.sendMessage(
                470,
                '18680392163',
                {
                    'no':456654
                },
                Meteor.bindEnvironment(callback)
            );
        });
    });

});
