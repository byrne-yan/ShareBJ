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
        let originProvider;
        beforeEach(()=>{
            originProvider = SMSDeliver._current;
            SMSDeliver._current = null;
        });
        afterEach(()=>{
            SMSDeliver._current = originProvider;
        });
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

    describe('haoservice_provider_basic',function(){
        //let originProvider;
        beforeEach(function(){
            this.originProvider = SMSDeliver._current;
            let testProvider = new HaoService();
            testProvider._key = "key1234567890123456789";
            testProvider._send_url = "http:/exmaple.com.sms/send";
            testProvider._status_url = "http:/exmaple.com.sms/status";
            testProvider._templates = {
                test:{"id":470,"params":["no"] }
            };
            SMSDeliver._current = testProvider;
        });
        afterEach(()=>{
            SMSDeliver._current= this.originProvider;
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
                expect(err).toBeUndefined();
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
    });

    describe('haoservice_provider_templates',function(){
        //let originProvider;
        beforeEach(()=>{
            //console.log('SMSDeliver._current:',SMSDeliver._current);
            this.originProvider = SMSDeliver._current;

            try{
                SMSDeliver.setProvider('haoservice');
            }catch(e){
                SMSDeliver.registerProvider('haoservice',new HaoService());
                SMSDeliver.setProvider('haoservice');
            }
        });
        afterEach(()=>{
            //console.log("originProvider:",this.originProvider);
            SMSDeliver._current= this.originProvider;
        });

        it('send register verification code',(done)=>{
            const expectedMinutes = 30,
                expectedCode='123456',
                expectedMobile = '15012345678';

            let random_sid = Math.floor(Random.fraction()*1000000);
            spyOn(HTTP, 'post').and.callFake(function(url,params,callback){
                Meteor.setTimeout(function(){
                    callback(undefined,{
                        statusCode:200,
                        content:'{"error_code":0,"reason":"成功","result":'+random_sid+'}'
                    });
                },100);
            });

            SMSDeliver.sendMessage('template:register',expectedMobile,{code:expectedCode,minutes:expectedMinutes},(err,id)=>{
                expect(err).toBeUndefined();
                expect(id).toBeDefined();
                expect(HTTP.post).toHaveBeenCalledWith(jasmine.any(String),{params:{
                        key:Meteor.settings.haoservice.key,
                        mobile:expectedMobile,
                        tpl_id:Meteor.settings.haoservice.templates.register.id,
                        tpl_value:encodeURIComponent(`#code#=${expectedCode}&#minutes#=${expectedMinutes}`)}}
                    ,jasmine.any(Function));
                done();
            });

        });
        it('send password_reset verification code',(done)=>{
                const expectedMinutes = 30,
                    expectedCode='123456',
                    expectedMobile = '15012345678';

                let random_sid = Math.floor(Random.fraction()*1000000);
                spyOn(HTTP, 'post').and.callFake(function(url,params,callback){
                    Meteor.setTimeout(function(){
                        callback(undefined,{
                            statusCode:200,
                            content:'{"error_code":0,"reason":"成功","result":'+random_sid+'}'
                        });
                    },100);
                });

                SMSDeliver.sendMessage('template:password_reset',expectedMobile,{code:expectedCode,minutes:expectedMinutes},(err,id)=>{
                    expect(err).toBeUndefined();
                    expect(id).toBeDefined();
                    expect(HTTP.post).toHaveBeenCalledWith(jasmine.any(String),{params:{
                            key:Meteor.settings.haoservice.key,
                            mobile:expectedMobile,
                            tpl_id:Meteor.settings.haoservice.templates.password_reset.id,
                            tpl_value:encodeURIComponent(`#code#=${expectedCode}&#minutes#=${expectedMinutes}`)}}
                        ,jasmine.any(Function));
                    done();
                });

        });
        it('send mobile_confirm verification code',(done)=>{
            const expectedMinutes = 30,
                expectedCode='123456',
                expectedMobile = '15012345678',
                expectedName = 'user',
                expectedNickname = 'nick';

            let random_sid = Math.floor(Random.fraction()*1000000);
            spyOn(HTTP, 'post').and.callFake(function(url,params,callback){
                Meteor.setTimeout(function(){
                    callback(undefined,{
                        statusCode:200,
                        content:'{"error_code":0,"reason":"成功","result":'+random_sid+'}'
                    });
                },100);
            });

            SMSDeliver.sendMessage('template:mobile_confirm',expectedMobile,{code:expectedCode,minutes:expectedMinutes,
                        name:expectedName,nickname:expectedNickname},(err,id)=>{
                expect(err).toBeUndefined();
                expect(id).toBeDefined();
                expect(HTTP.post).toHaveBeenCalledWith(jasmine.any(String),{params:{
                        key:Meteor.settings.haoservice.key,
                        mobile:expectedMobile,
                        tpl_id:Meteor.settings.haoservice.templates.mobile_confirm.id,
                        tpl_value:encodeURIComponent(`#code#=${expectedCode}&#minutes#=${expectedMinutes}&#name#=${expectedName}&#nickname#=${expectedNickname}`)}}
                    ,jasmine.any(Function));
                done();
            });

        });
        it('send initial password',(done)=>{
            const expectedPassword='123456',
                expectedMobile = '15012345678';

            let random_sid = Math.floor(Random.fraction()*1000000);
            spyOn(HTTP, 'post').and.callFake(function(url,params,callback){
                Meteor.setTimeout(function(){
                    callback(undefined,{
                        statusCode:200,
                        content:'{"error_code":0,"reason":"成功","result":'+random_sid+'}'
                    });
                },100);
            });

            SMSDeliver.sendMessage('template:initial_password',expectedMobile,{password:expectedPassword},(err,id)=>{
                expect(err).toBeUndefined();
                expect(id).toBeDefined();
                expect(HTTP.post).toHaveBeenCalledWith(jasmine.any(String),{params:{
                        key:Meteor.settings.haoservice.key,
                        mobile:expectedMobile,
                        tpl_id:Meteor.settings.haoservice.templates.initial_password.id,
                        tpl_value:encodeURIComponent(`#password#=${expectedPassword}`)}}
                    ,jasmine.any(Function));
                done();
            });

        });
    });
});
