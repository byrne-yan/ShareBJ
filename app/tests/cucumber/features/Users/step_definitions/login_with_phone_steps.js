module.exports = function(){
    this.Given(/^I have register with a verified phone$/, function (callback) {

        this.server.call('fixtures/registerUserWithPhone','18612345678','123456');

        return Promise.all([
            this.server.call('fixtures/getUserWithPhone','18612345678')
                .should.eventually.have.deep.property('phone.verified', true),
            //.and.notify(callback);
            this.client
                .timeoutsAsyncScript(5000)
                .executeAsync(function(done){
                    done(Meteor.user());
                })
                .should.eventually.have.property('value')
                .that.equals(null)]
        );
            //.and.notify(callback);
    });


    this.When(/^I visit sign in page and then input my phone and password correctly$/, function (callback) {
        var mobile = '18612345678';
        var password = '123456';
        return this.client
            .url(process.env.ROOT_URL + 'users/login')
            .waitForExist('#username')
            .setValue('#username', mobile)
            .setValue('#password', password)
            .click('#loginButton')
            .pause(1000)
            .getText('#errorMessages')
            .should.eventually.to.be.empty;
    });

    this.Then(/^I logined$/, function (callback) {

        this.client
            .timeoutsAsyncScript(5000)
            .executeAsync(function(done){
                done(Meteor.user());
            })
            .should.eventually.have.property('value')
            .that.have.deep.property('phone.number','18612345678')
            .and.notify(callback);

    });
};