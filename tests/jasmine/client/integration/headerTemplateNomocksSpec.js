describe("Header template(No Mocks)", function() {
    xit("should  show neither new baby link nor new journal link for anonymous user", function (done) {
        Meteor.logout(function(err) {
            expect(err).toBeUndefined();
            expect(Meteor.user()).toBeNull();

            //expect(Blaze._globalHelpers.currentBaby.apply()).toBeNull();
            var div = document.createElement("DIV");
            Blaze.render(Template.header, div);

            expect($(div).find("#journalSubmitLink")[0]).not.toBeDefined();
            expect($(div).find("#babySubmitLink")[0]).not.toBeDefined();
            done();
        });
    });

    it("should show new journal link but new baby link for registered user owning a baby", function (done) {
        Meteor.loginWithPassword('user1', '123456', function (err) {
            expect(err).toBeUndefined();

            expect(Meteor.user()).not.toBeNull();
            expect(Meteor.user().username).toEqual('user1');
            expect(Blaze._globalHelpers.currentBaby.apply()).not.toBeNull();

            var div = document.createElement("DIV");
            Blaze.render(Template.header, div);
            expect($(div).find("#journalSubmitLink")[0]).toBeDefined();
            expect($(div).find("#babySubmitLink")[0]).not.toBeDefined();

            done();
        });
    });
    it("should be able to logout", function (done) {
        Meteor.logout(function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });

    xit("should show both new journal link and new baby link for registered user without owned baby", function (done) {
        expect(Meteor.user()).toBeNull();
        Meteor.loginWithPassword('user3', '123456', function (err) {
            expect(Meteor.user()).not.toBeNull();

            var div = document.createElement("DIV");
            Blaze.render(Template.header, div);
            expect($(div).find("#journalSubmitLink")[0]).toBeDefined();
            expect($(div).find("#babySubmitLink")[0]).toBeDefined();
            done();
        });
    });

    it("should be able to logout", function (done) {
        Meteor.logout(function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });

});