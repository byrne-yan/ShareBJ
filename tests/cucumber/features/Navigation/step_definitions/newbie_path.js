module.exports = function () {
    this.Given(/^The app started and login page showed$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        return this.client.url(process.env.ROOT_URL + 'users/login');
    });

    this.When(/^I click register link$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        return this.client
            .waitForExist('#enroll')
            .click('#enroll');
    });

    this.When(/^I input phone  number, get verification code and then register$/, function (callback) {
        var client = this.client;
        client
            //.waitForExist('#mobile')
            .waitForVisible('#mobile')
            .setValue('#mobile', '15012345678')
            .waitForEnabled('#code_button')
            .pause(500)
            .click('#code_button')
            .waitForEnabled('#code')
            .executeAsync(function (done) {
                Meteor.call('fixtures/getSMSCode', '15012345678', function (err, code) {
                    return done(code);
                })
            })
            .then(function (res) {
                return client.setValue('#code', res.value)
            }, callback.fail)
            .waitForEnabled('#signupButton')
            .pause(200)
            .click('#signupButton')
            .pause(2000)
            .url()
            //.then(function(res){
            //    expect(res.value).to.equal(process.env.ROOT_URL+'babies/list');
            //    callback();
            //},callback.fail);
            .should.eventually.have.property('value')
            .that.equal(process.env.ROOT_URL + 'babies/list')
            .and.notify(callback);
    });

    this.Then(/^Babies list page shows with no back button$/, function (callback) {
        this.client
            .url()
            .then(function (res) {
                expect(res.value).to.equal(process.env.ROOT_URL + 'babies/list');
                callback();
            }, callback.fail)
            .waitForExist('#baby-search', undefined, true)
            //.should.eventually.be.true
            //.catch(callback.fail);
            .then(function (res) {
                console.log(res.value);
                callback();
            }, function (err) {
                console.log(err);
                callback.fail();
            })

    });

}