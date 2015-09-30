describe('avatar_upload_client', function (done) {
    beforeAll((done)=>{
        Meteor.call('fixtures/users/reset',function(err) {
            if(!err) done();
            else console.log(err);
        });
    });

    describe('no_login',()=>{
      it('define a angular module "shareBJ.avatar"',()=> expect(angular.module('shareBJ.avatar')).toBeDefined());

      it('defines Avatars', () => {
        expect(Avatars).toBeDefined();
      });
    });

    xdescribe('with_login',()=>{
        beforeAll((done)=>{
            Meteor.call('fixtures/users/makeupTest1',function(err) {
                if(!err) done();
                else console.log(err);
            });
        });
        beforeEach((done)=>{
           Meteor.loginWithPassword('test1','test1',(err)=>{
               if(!err)　done();
               else console.log(err);
           })
        });
        xit('inserts a record with id and url',function(done){
            const id=Random.id();
            const url = 'https:/exmaple.com/'+id;


            function onResult(err,res){
                expect(err).toBe(undefined);
                if(err) return done();

                expect(res).toEqual(id);
                Meteor.call('fixtures/avatar/get',id,function(err,res){
                    expect(err).toBe(undefined);
                    expect(res.url).toEqual(url);
                    done();
                })
            };

            Meteor.call('avatar/upload',id,url,onResult);
        });

        xit('uploads image to S3 with login user', (done) => {
                expect(Meteor.userId()).toBeDefined();
            var sample ='data:image/gif;base64,R0lGODlhEAAOALMAAOazToeHh0tLS/7LZv/0jvb29t/f3//Ub//ge8WSLf/rhf/3kdbW1mxsbP//mf///yH5BAAAAAAALAAAAAAQAA4AAARe8L1Ekyky67QZ1hLnjM5UUde0ECwLJoExKcppV0aCcGCmTIHEIUEqjgaORCMxIC6e0CcguWw6aFjsVMkkIr7g77ZKPJjPZqIyd7sJAgVGoEGv2xsBxqNgYPj/gAwXEQA7';

            Avatars.upload(sample,Meteor.userId())
                .then(function(res){
                  expect(res).not.toBe(null);
                  done();
                })
                .catch(function(err){
                  expect(err).toBe(null);
                  done();
                })
            }
        );
    })
});