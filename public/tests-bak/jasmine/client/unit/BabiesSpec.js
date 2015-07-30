describe('Babies', function () {
    'use strict';

    beforeEach(function () {
        //MeteorStubs.install();
        mock(window, 'Babies');

    });

    afterEach(function () {
        //MeteorStubs.uninstall();
    });

    it('should has no currentBaby without logged in user', function () {
        spyOn(Meteor,'userId').and.returnValue(null);
        spyOn(Babies,'find').and.returnValue(undefined);
        expect(Blaze._globalHelpers.currentBaby).toBeDefined();
        var baby = Blaze._globalHelpers.currentBaby.apply();
        expect(Meteor.userId).toHaveBeenCalled();
        expect(Babies.find).not.toHaveBeenCalled();

        expect(baby).toBeNull();
    });

    it('should has no currentBaby when a logged in user without ownBaby ', function () {
        var fake = new Meteor.Collection(null);
        var r = {
            name:'test',
            nickname:'testnickname',
            _id:'1',
            owners:[]
        };
        fake.insert(r);
        spyOn(Babies,'find').and.callFake(function(a,b){return fake.find(a,b)});
        spyOn(Babies,'findOne').and.callFake(function(a,b){return fake.findOne(a,b)});
        spyOn(Meteor,'userId').and.returnValue('1');

        var baby = Blaze._globalHelpers.currentBaby.apply();
        expect(Meteor.userId).toHaveBeenCalled();
        expect(Babies.find).toHaveBeenCalled();
        expect(Babies.findOne).not.toHaveBeenCalled()
        expect(baby).toBeNull();
    });

    it('should has currentBaby when a logged in user with ownBaby ', function () {
        var fake = new Meteor.Collection(null);
        var r = {
            name:'test',
            nickname:'testnickname',
            _id:'1',
            owners:['1']
        };
        fake.insert(r);
        spyOn(Meteor,'userId').and.returnValue('1');
        spyOn(Babies,'find').and.callFake(function(a,b){return fake.find(a,b)});
        spyOn(Babies,'findOne').and.callFake(function(a,b){return fake.findOne(a,b)});

        var baby = Blaze._globalHelpers.currentBaby.apply();
        expect(Meteor.userId).toHaveBeenCalled();
        expect(Babies.find).toHaveBeenCalled();
        expect(Babies.findOne).toHaveBeenCalled();
        expect(baby).not.toBeNull();

    });
});