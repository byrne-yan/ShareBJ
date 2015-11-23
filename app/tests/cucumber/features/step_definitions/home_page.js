module.exports = function(){
    userId = null;
    babyId = null;

this.Given(/^I have signed up$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return userID = this.server.call('signUp',{
        username:'test_user',
        password:'123456',
        email:'tests@hy-studio.cn',
        profile:{name:'Byrne Yan'}
    });
});

this.Given(/^My baby's profile created$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    //console.log(userId);
    return babyId = this.server.call('registerBaby', userId, {
        name:"Taro",
        birthTime:new Date(2015,5,9,11,20),
        gender:'female',
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
        .pause(1000)
    ;
});

this.Then(/^my baby's basic information\(name,age\) and her\/his recorded history behaviours showed$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return this.client
        .waitForExist('ion-nav-title')
        .url(function(err,res){
            expect(err).to.be.undefined;
　           expect(res.value).to.equal(process.env.ROOT_URL+'journals');
        })
        .getText('.nav-bar-title').then(function(text){
            expect(text).to.equal('test_user-Journals');
        }

    );
});

this.Then(/^a button to create new baby$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return this.client
        .click(".ion-navicon")
        .waitForVisible('a[ui-sref=".babies.new"')
        .pause(500)
        .click('a*=添加新宝宝')
        .pause(1000)
        .url(function(err,res){
                expect(err).to.be.undefined;
                expect(res.value).to.equal(process.env.ROOT_URL+'babies/new');
            }
        );
    //callback.pending();
});

this.Then(/^a button to show my profile$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return this.client
        .click(".ion-navicon")
        .waitForVisible('a[ui-sref=".users_edit"')
        //.getText('a.item-avatar h2').then(function(text){
        //    expect(text).to.equal('test_user');
        //}).catch(function(reason) {
        //    expect(reason).to.equal(false)
        //})
    ;
    //callback.pending();
});

this.Then(/^a button to show baby's profile$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    return this.client
        .click(".ion-navicon")
        .waitForVisible('a[ui-sref=".babies.edit"')
        .pause(500)
        .click('a*=Taro')
        .pause(1000)
        .url(function(err,res){
            expect(err).to.be.undefined;
            expect(res.value).to.equal(process.env.ROOT_URL+'babies/'+babyId);
        }
    );
    callback.pending();
});

this.Then(/^a button to create a new journal$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
});



this.Then(/^a button to switch baby$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
});



}