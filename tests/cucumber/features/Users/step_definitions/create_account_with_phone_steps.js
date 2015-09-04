module.exports = function(){
    this.Given(/^No enrollment with my phone$/, function (callback) {
        return this.server.call('fixtures/getUserWithPhone','18612345678')
            .should.eventually.to.be.undefined;
    });

    this.When(/^I visit enrollment page and then input my phone$/, function (callback) {
        var mobile = '18612345678';
        var name = 'tester';

        self = this;
        this.client
            .url(process.env.ROOT_URL + 'users/signup_phone?mobile='+mobile+'&name='+name)
            .pause(200)
            .url()
            .should.eventually.have.deep.property('value')
            .that.is.equal(process.env.ROOT_URL + 'users/signup_phone?mobile='+mobile+'&name='+name)
            .waitForEnabled('#code_button')
            .click('#code_button')
            .waitForEnabled('#code')
            .executeAsync(function(done){
                Meteor.call('fixtures/getSMSCode','18612345678',function(err,res){
                    done(res);
                })
            })
            .then(function (res) {
                console.log("returned sms code:",res.value);
                return self.client
                    .waitForEnabled('#code')
                    .setValue("#code",res.value)
                    .waitForEnabled('#signupButton')
                    .click('#signupButton')
                    .pause(200)
                    .getText('#errorMessages')

            }, callback.fail)
            .should.eventually.to.be.empty
            .and.notify(callback);

    });

    this.Then(/^I is logined$/, function (callback) {
        return this.client
            .timeoutsAsyncScript(5000)
            .execute("return Meteor.user()")
            .should.eventually.have.property('value')
            .that.satisfy(function (user) {
                return user.phone.number === '18612345678'
                && user.username==='号码18612345678'
                && user.profile.name === 'tester'
            }).catch(callback.fail);
    });

};