module.exports = function () {
    this.Given(/^The app started and login page showed$/, function () {
        // Write code here that turns the phrase above into concrete actions
        client.url(process.env.ROOT_URL + 'users/login');
    });

    this.When(/^I click register link$/, function () {
        // Write code here that turns the phrase above into concrete actions
        client.waitForExist('#enroll');
        client.click('#enroll');
    });

    this.When(/^I input phone  number, get verification code and then register$/, function () {
        client.waitForExist('.click-block-hide');

        client.waitForExist('#name');
        expect(client.isVisible('#name')).toBe(true);
        client.setValue('#name', '手机15012345678');

        client.waitForExist('#mobile');
        expect(client.isVisible('#mobile')).toBe(true);
        client.setValue('#mobile', '15012345678');

        client.waitForEnabled('#code_button');
        expect(client.isEnabled('#code_button')).toBe(true);

        client.click('#code_button');

        client.waitForEnabled('#code');
        var code = server.call('fixtures/getSMSCode', '15012345678');

        expect(code).toBeDefined();
        expect(code.length).toEqual(6);
        console.log('code:'+code);
        client.setValue('#code', code);
        client.waitForEnabled('#signupButton');

        client.click('#signupButton');
        client.pause(300);
        expect(client.url().value).toEqual(process.env.ROOT_URL + 'babies/list');
    });

    this.Then(/^Babies list page shows with no back button$/, function () {
        client.waitForExist('#baby-search');
        client.pause(200);
        expect(client.isVisible('#baby-search')).toBe(true);
    });

};