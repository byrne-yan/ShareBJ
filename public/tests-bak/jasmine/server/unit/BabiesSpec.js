describe('Babies', function () {
    'use strict';

    beforeEach(function () {
        //MeteorStubs.install();
        mock(global, 'Babies');
    });

    afterEach(function () {
        //MeteorStubs.uninstall();
    });

    describe('babyInsert', function () {
        it('should be inserted with full attributes', function () {
            var baby= {
                name : "baby1",
                nickname:'yutou',
                conceptionDate : new Date(2014, 9, 6),
                gender:'男',
                birthTime: new Date(2015,6,9,11,20),
                birthHeight:49,
                birthWeight:2900,
                height:49,
                weight:2900,
                id:'44030620150609062X',
                siId:'32534653'
            }
            spyOn(Babies,'insert').and.returnValue(1);
            spyOn(Meteor,'user').and.returnValue({username:'byrne',_id:'1'});


            Meteor.call('babyInsert', baby, function (error, result) {
                expect(error).toBe(null);
                expect(result).toBeDefined();
                expect(result._id).toBeDefined();
                expect(result._id).toEqual(1);
            });

        });
        it('should not be inserted without login', function () {
            var baby= {
                name : "baby1",
                nickname:'yutou',
                conceptionDate : new Date(2014, 9, 6),
                gender:'男',
                birthTime: new Date(2015,6,9,11,20),
                birthHeight:49,
                birthWeight:2900,
                height:49,
                weight:2900,
                id:'44030620150609062X',
                siId:'32534653'
            }
            spyOn(Babies,'insert').and.returnValue(1);
            spyOn(Meteor,'user').and.returnValue(undefined);


            Meteor.call('babyInsert', baby, function (error, result) {
                expect(error).toBeDefined();
                expect(result).toBeUndefined();
            });

        });

        it('should not be inserted without conceptionDate', function () {
            var baby= {
                name : "baby1",
                nickname:'yutou',
                //conceptionDate : new Date(2014, 9, 6),
                gender:'男',
                birthTime: new Date(2015,6,9,11,20),
                birthHeight:49,
                birthWeight:2900,
                height:49,
                weight:2900,
                id:'44030620150609062X',
                siId:'32534653'
            }
            spyOn(Babies,'insert').and.returnValue(1);
            spyOn(Meteor,'user').and.returnValue({username:'byrne',_id:'1'});


            Meteor.call('babyInsert', baby, function (error, result) {
                expect(error).toBeDefined();
                expect(result).toBeUndefined();
            });

        });
    });

});