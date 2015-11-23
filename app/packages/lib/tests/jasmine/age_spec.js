describe('age calculation',function(){
    beforeEach(function(){
        this.born = new Date('2015-06-09T11:20:00.000Z');
    })
    it('returns birth',function(){
        var then = new Date('2015-06-09T11:30:00.000Z');

        var result = ageOf(this.born,then);

        expect(result).toBeDefined();
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual(0);
        expect(result[3]).toEqual('出生');
    })

    it('returns full month',function(){
        var then = new Date('2015-07-09T08:30:00.000Z');

        var result = ageOf(this.born,then);

        expect(result).toBeDefined();
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual(0);
        expect(result[3]).toEqual('满月');
    })

    it('returns hundred-day',function(){
        var then = new Date('2015-09-17T10:00:00.000Z');

        var result = ageOf(this.born,then);

        expect(result).toBeDefined();
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(3);
        expect(result[2]).toEqual(8);
        expect(result[3]).toEqual('百天');
    })

    it('returns 1+27',function(){
        var then = new Date('2015-08-05T10:00:00.000Z');

        var result = ageOf(this.born,then);

        expect(result).toBeDefined();
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual(27);
        expect(result[3]).toEqual('1个月27天');
    })

})