module.exports = function () {
    this.Before(function () {
        var client = this.client;
        this.AuthHelper = {
            login: function (username,password) {

                    client
                    .url(process.env.ROOT_URL + '/login')
                    .waitForExist('#username')
                    .setValue('#username', username)
                    .setValue('#password', password)
                    .click('#loginButton');
                    //.waitForExist('#login-name-link');
            },

            logout: function () {
                client.executeAsync(function (done) {
                    Meteor.logout(done);
                });
            },

            currentUser: function(){
                return this.server.call('fixtures/currentUser')
            }

            //createAccount: function (profile) {
            //    profile = profile || {
            //            periodEnd: Math.floor(new Date().getTime() / 1000)
            //        };
            //
            //    return server.call('fixtures/createAccount', {
            //        email: 'me@example.com',
            //        password: 'letme1n',
            //        profile: profile
            //    });
            //},
            //
            //createAccountAndLogin : function(profile) {
            //    this.createAccount(profile);
            //    this.login();
            //}
        };

    });
};