module.exports = function(){
    userId = null;

this.Given(/^I have signed up$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return userID = this.server.call('signUp',{
        username:'test_user',
        password:'123456',
        email:'test@hy-studio.cn',
        profile:{name:'Byrne Yan'}
    });
});

this.Given(/^My baby's profile created$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    //console.log(userId);
    return this.server.call('registerBaby', userId, {
        name:"Taro",
        birthTime:new Date(2015,5,9,11,20),
        genre:'female',
        owners:[userId]
    });

});

this.When(/^I sign in$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    this.client
        .url(process.env.ROOT_URL)
        .click('#loginButton')
        .catch()
    ;
});

this.Then(/^my baby's basic information\(name,age\) and her\/his recorded history behaviours showed$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    this.client.url()
        .should.eventually.equals(process.env.ROOT_URL+'/journals')

    callback.pending();
});
}