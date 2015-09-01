describe('sms',function(){
    'use strict';

    beforeEach(function(){
        MeteorStubs.install();
    });

    afterEach(function(){
        MeteorStubs.uninstall();
    });

    describe('sms-engine',function(){
        var originalSMS;
        beforeEach(function(){
            originalSMS = SMSDeliver;
        });
        afterEach(function(){
            SMSDeliver =originalSMS;
            //SMSDeliver._providers = {};
            //SMSDeliver._current = null;
        });

        it('exports SMSDeliver',function(){
            expect(SMSDeliver).toBeDefined();
        });

        it('should be able to register a provider', function(){
            expect(SMSDeliver._providers.testProvider).not.toBeDefined();
            SMSDeliver.registerProvider('testProvider',{});
            expect(SMSDeliver._providers.testProvider).toBeDefined();
        });

        it('should not select an invalid sms provider', function() {
            var callSetProvider = function(){
                SMSDeliver.setProvider('invalidProvider');
            };
            expect(callSetProvider).toThrow();
        });

        it('should select a valid sms provider', function(){

            SMSDeliver.registerProvider('testProvider',{});

            SMSDeliver.setProvider('testProvider');
            expect(SMSDeliver._current).not.toBeNull();

        });

        xit("should call provider's sendMessage", function(){
           var provider = {
               sendMessage: function(template, mobile, options, callback){
                    callback(null,{result:'OK'});
                }
           };
            spyOn(provider,'sendMessage');

            SMSDeliver.registerProvider('testProvider',provider);
            SMSDeliver.setProvider('testProvider');
            var callback = function(err,result){};

            SMSDeliver.sendMessage('temp','12345678',{},callback)
            expect(provider.sendMessage).toHaveBeenCalledWith('temp','12345678',{},callback);
        });
    });

});
