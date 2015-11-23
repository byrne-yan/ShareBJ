describe('reports_address',()=>{
    it('reports public address to server',(done)=>{
        Meteor.call('reports/address','113.113.113.113',function(err,connnectinId){
            expect(err).toBeUndefined();
            expect(connnectinId).toBeDefined();
            done();
        })
    })
});