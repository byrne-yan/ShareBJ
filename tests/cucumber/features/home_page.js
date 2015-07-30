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
    //callback.pending();
    return this.client
        .url(process.env.ROOT_URL+'/login')
        .waitForExist('body *')
        .setValue('input[name="username"','test_user')
        .setValue('input[name="password"','123456')
        .submitForm('#loginForm')
        //.then(callback)
        .pause(500)
    ;
});

this.Then(/^my baby's basic information\(name,age\) and her\/his recorded history behaviours showed$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return this.client.url(function(err,res){
        expect(err).to.be.undefined;
        expect(res.value).to.equal(process.env.ROOT_URL+'journals');

    });
});
this.Then(/^a button to create a new journal$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
});

this.Then(/^a button to create new baby$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
});

this.Then(/^a button to switch baby$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
});

this.Then(/^a button to show my profile$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
});

this.Then(/^a button to show baby's profile$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
});

}