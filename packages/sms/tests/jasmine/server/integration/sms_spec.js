describe('SMSManager',function(){
    'use strict';

    beforeAll(function(){
        //SMSDeliver.registerProvider('twilio',TwilioProvider);

    });

    beforeEach(function(){
        //mock(global,'Twilio');
        //console.log("registerProvider",SMSDeliver._providers);

    });

    describe("devmode",()=>{
        beforeEach(()=>{
            SMSDeliver._current = null;
        })
        it("output sms content to stdout and return fake messageId",(done)=>{
            SMSDeliver.sendMessage('template:test','15012345678',{no:12346},(err,messageId)=>{
                expect(err).toBe(null);
                expect(messageId).toBeDefined();
                done();
            });
        })
    })

    xdescribe("twilio_provider",()=>{
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
                    },100)
                });

                var callback =  function(err,messageId){
                    expect(err).toBeNull();
                    expect(messageId).toEqual(random_sid);
                    done();
                };

                SMSDeliver.sendMessage('[ShareBJ]这是一封测试短信',
                    '18612345678',
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
        })
    });

    describe('haoservice_provider',function(){
        beforeAll(function(){

            SMSDeliver.setProvider('haoservice');
            SMSDeliver._current._key = "key1234567890123456789";
            SMSDeliver._current._send_url = "http:/exmaple.com.sms/send";
            SMSDeliver._current._status_url = "http:/exmaple.com.sms/status";
            SMSDeliver._current._templates = {
                test:{"id":470,"params":["no"] }
            };

        });

        it('should has a name',function(){
            expect(SMSDeliver._current.name).toEqual('haoservice');
        });
        it('reject sending missing some paramters',()=>{
            let fn = ()=>{
                SMSDeliver.sendMessage( 'template:test',  '18612345678',  {} )
            };
            expect(fn).toThrow();
        });
        it('can send a message to a mobile with a template name and parmas', function(done){
            var random_sid = Math.floor(Random.fraction()*1000000);
            spyOn(HTTP, 'post').and.callFake(function(url,params,callback){
                Meteor.setTimeout(function(){
                    callback(null,{
                        statusCode:200,
                        content:'{"error_code":0,"reason":"成功","result":'+random_sid+'}'
                    });
                },100);
            });
            var callback =function(err,result){
                expect(err).toBeNull();
                expect(result.messageId).toEqual(random_sid);
                done();
            };


            SMSDeliver.sendMessage(
                'template:test',
                '18612345678',
                {
                    'no':343455
                },
                Meteor.bindEnvironment(callback)
            );
            var expectedValue = {
                url:"http:/exmaple.com.sms/send",
                param:
                    {
                        params:{
                            key:"key1234567890123456789",
                            mobile:'18612345678',
                            tpl_id:470,
                            tpl_value:'%23no%23%3D343455'
                        }
                    }
            };
            expect(HTTP.post).toHaveBeenCalledWith(
                expectedValue.url,
                expectedValue.param,
                jasmine.any(Function)
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
