//jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;

describe('Images_on_client',()=> {


    describe('Uploads',()=>{
        beforeAll((done)=> {
            Meteor.call('fixtures/users/reset', function (err, res) {
                if (!err) {
                    Accounts.createUser({username:'test1',password:'test1'},(err,res)=>{
                        done();
                    })
                }
            })
        });

        afterEach(()=>{
            Uploads.clearUploaders();
        });

        it('define _uploaders',()=>{
            expect(Uploads._uploaders).toBeDefined();
        });

        it('requests an uploader for images',()=>{
            var expectedValue = {
                uploaderId:'uid1234567890',
                journalId:'jid1234567890',
                imageId:'iid1234567890'
            };
            spyOn(Random,'id').and.returnValue(expectedValue.uploaderId);
            Uploads.requestUploader("imageUploads",expectedValue.journalId,expectedValue.imageId,{width:600,height:800});
            expect(Uploads._uploaders[expectedValue.uploaderId]).toBeDefined();
            expect(Uploads._uploaders[expectedValue.uploaderId]._journalId).toEqual(expectedValue.journalId);
        });

        it('record progress when sending image',(done)=>{
            var expectedValue = {
                journalId:'jid1234567890',
                imageId:'iid1234567890',
                recordId:'rid1234567890'
            };
            var uploader = Uploads.requestUploader("originUploads",expectedValue.journalId,expectedValue.imageId,{width:600,height:800});
            expect(uploader).toBeDefined();
            expect(uploader._id).toBeDefined();
            blob  ={
                type:'image/jpeg',
                name:'testname',
                size:65
            };

            spyOn(Uploads._uploaders[uploader._id]._uploader,'send').and.callFake((file,callback)=>{
                callback(null,uploader._id);
            });
            spyOn(Uploads,'insert').and.callThrough();

            uploader.send(blob,(err,res)=>{
                expect(err).toBe(null);
                expect(res).toEqual(uploader._id);
                expect(Uploads.insert).toHaveBeenCalled();
                var record = LocalCollection.findOne({uploader:uploader._id});
                console.log(record);
                expect(record).toBeDefined();
                expect(record.journal).toEqual(expectedValue.journalId);
                expect(record.filename).toEqual(blob.name);
                expect(_.isFinite(record.progress)).toBe(true);
                done();
            })
        });


        describe('progress',()=>{
            it('reports uploading progress',(done)=>{
                var expectedValue = {
                    journalId:'jid1234567890',
                    imageId:'iid1234567890'
                };
                var uploader = Uploads.requestUploader("originUploads",expectedValue.journalId,expectedValue.imageId,{width:600,height:800});
                //console.log(uploader._id);
                blob  ={
                    type:'image/jpeg',
                    name:'testname',
                    size:65
                };


                var reactiveProgress = new ReactiveVar(0);
                var reactiveStatus = new ReactiveVar('idle');
                //set progress
                spyOn(uploader._uploader,'status').and.callFake(()=>{ return reactiveStatus.get()});
                spyOn(uploader._uploader,'progress').and.callFake(()=>{ return reactiveProgress.get()});
                spyOn(uploader._uploader,'send').and.callFake((file,callback)=>{
                    reactiveStatus.set('transfering');
                    var count = 5;
                    function forward(callback){
                        //console.log('set progress:'+(5-count)/5.0);
                        reactiveProgress.set((5-count+1)/5.0);
                        count--;
                        if(count<=0){
                            reactiveStatus.set('done');
                            callback(null);
                        }
                    };
                    this.timer = setInterval(forward,100,callback);
                });
                spyOn(Uploads,'update').and.callThrough();
                spyOn(Uploads,'insert').and.callThrough();

                uploader.send(blob,(err,res)=> {
                    clearInterval(this.timer);
                    expect(Uploads.insert.calls.count()).toEqual(1);
                    //console.log(Uploads.update.calls.all());
                    expect(Uploads.update.calls.count()).toEqual(7);
                    expect(Uploads.update.calls.argsFor(0)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(0)[1]).toEqual({$set:{progress:0,status:'idle'}})//modifier
                    expect(Uploads.update.calls.argsFor(1)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(1)[1]).toEqual({$set:{progress:0,status:'transfering'}})//modifier
                    expect(Uploads.update.calls.argsFor(2)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(2)[1]).toEqual({$set:{progress:20,status:'transfering'}})//modifier
                    expect(Uploads.update.calls.argsFor(3)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(3)[1]).toEqual({$set:{progress:40,status:'transfering'}})//modifier
                    expect(Uploads.update.calls.argsFor(4)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(4)[1]).toEqual({$set:{progress:60,status:'transfering'}})//modifier
                    expect(Uploads.update.calls.argsFor(5)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(5)[1]).toEqual({$set:{progress:80,status:'transfering'}})//modifier
                    expect(Uploads.update.calls.argsFor(6)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector

                    expect(Uploads.update.calls.argsFor(6)[1]['$set'].progress).toEqual(100);
                    expect(Uploads.update.calls.argsFor(6)[1]['$set'].status).toEqual('done');
                    expect(Uploads.update.calls.argsFor(6)[1]['$set'].end).toBeDefined();
                    done();
                });
            });
            it('abort upload',(done)=>{
                var expectedValue = {
                    journalId:'jid1234567891',
                    imageId:'iid1234567891'
                };
                var uploader = Uploads.requestUploader("originUploads",expectedValue.journalId,expectedValue.imageId,{width:600,height:800});
                //console.log(uploader._id);
                blob  ={
                    type:'image/jpeg',
                    name:'testname',
                    size:65
                };


                var reactiveProgress = new ReactiveVar(0);
                var reactiveStatus = new ReactiveVar('idle');
                //set progress
                spyOn(uploader._uploader,'status').and.callFake(()=>{ return reactiveStatus.get()});
                spyOn(uploader._uploader,'progress').and.callFake(()=>{ return reactiveProgress.get()});

                var registerCallback;
                spyOn(uploader,'abort').and.callFake(()=>{
                    reactiveStatus.set('abort');
                    registerCallback('abort by user');
                });
                spyOn(uploader._uploader,'send').and.callFake((file,callback)=>{
                    registerCallback = callback;
                    reactiveStatus.set('transfering');
                    var count = 5;
                    function forward(callback){
                        //console.log('set progress:'+(5-count)/5.0);
                        reactiveProgress.set((5-count+1)/5.0);
                        count--;
                        if(count<=0){
                            reactiveStatus.set('done');
                            callback(null);
                        }
                    };
                    this.timer = setInterval(forward,100,callback);
                    setTimeout(()=>{
                        uploader.abort();
                    },300)
                });
                spyOn(Uploads,'update').and.callThrough();
                spyOn(Uploads,'insert').and.callThrough();

                uploader.send(blob,(err,res)=> {
                    clearInterval(this.timer);
                    expect(Uploads.insert.calls.count()).toEqual(1);
                    //console.log(Uploads.update.calls.all());
                    expect(Uploads.update.calls.count()).toEqual(5);
                    expect(Uploads.update.calls.argsFor(0)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(0)[1]).toEqual({$set:{progress:0,status:'idle'}})//modifier
                    expect(Uploads.update.calls.argsFor(1)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(1)[1]).toEqual({$set:{progress:0,status:'transfering'}})//modifier
                    expect(Uploads.update.calls.argsFor(2)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(2)[1]).toEqual({$set:{progress:20,status:'transfering'}})//modifier
                    expect(Uploads.update.calls.argsFor(3)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(3)[1]).toEqual({$set:{progress:40,status:'transfering'}})//modifier

                    expect(Uploads.update.calls.argsFor(4)[0]).toEqual({_type:'upload',uploader:uploader._id});//selector
                    expect(Uploads.update.calls.argsFor(4)[1]['$set']).toBeDefined();
                    expect(Uploads.update.calls.argsFor(4)[1]['$set'].progress).toEqual(40);
                    expect(Uploads.update.calls.argsFor(4)[1]['$set'].status).toEqual('abort');
                    expect(Uploads.update.calls.argsFor(4)[1]['$set'].end).toBeDefined();

                    done();
                });
            });
        })
    });

    it('calls the callback for thumb uploader with proper parameters', (done)=> {

        var journalId = Random.id();

        var expectedUrl = "http://example.com";

        spyOn(Slingshot,'Upload').and.callFake((name,option)=>{
            return {
                send: (data,callback)=>{
                    callback(null,expectedUrl);
                }
            }
        });

        Images.uploadThumbs([{filename: 'test.jpg', dataAsUrl: ""}], journalId,function(resolve,reject,jId,idx,downloadUrl,babyId) {
            expect(idx).toEqual(0);
            expect(jId).toEqual(journalId);
            expect(babyId).toBeDefined();
            expect(downloadUrl).toEqual(expectedUrl);
            reject();
        }).then((res)=>{
            done(null,res);
        }).catch((err)=>{
            done(err);
        });

    })
});