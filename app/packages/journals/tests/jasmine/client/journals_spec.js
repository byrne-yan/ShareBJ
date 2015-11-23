describe('journal publish', function () {



    describe('myViewableJournals',function(){
        beforeEach(function(done){
            //users u1, u2, u3
            //two babies b1, b2
            //u2 guardians b1
            //u1 guardians b1 b2
            //u3 follows b1
            //u1 wrote j1 for b1, j2 for b2
            //u2 wrote j3, j4 for b1
            this.users =[
                { name:'user1', password: 'test1'},
                { name:'user2', password: 'test2'},
                { name:'user3', password: 'test3'}
            ];
            this.babies = [
                { name: "baby1"},
                { name: "baby2"}
            ];
            this.journals = [
                {description:'journal121'},
                {description:'journal242'},
                {description:'journal313'},
                {description:'journal414'}
            ];

            var self = this;
            Meteor.call('fixtures/reset',resetAllOK);
            function resetAllOK(err){
                Meteor.call('fixtures/users/create', self.users,usersCreated);
            }
            function usersCreated(err,users){
                if(err){
                    console.log(err);
                    expect(false).toBe(true);
                    done();
                }
                _.each(users,function(user,idx){
                    self.users[idx]._id = user;
                });

                //debugger;
                self.babies[0].owners = _.first(users,2);
                self.babies[0].followers = _.last(users,1);


                self.babies[1].owners = _.first(users,1);
                self.babies[1].followers = [];

                Meteor.call('fixtures/babies/create', self.babies, babiesCreated);
            }
            function babiesCreated(err,babies){
                //console.log(babies);
                _.each(babies,function(baby,idx){
                    self.babies[idx]._id = baby;
                });

                self.journals[0].author = self.users[0]._id;
                self.journals[0].baby = self.babies[0]._id;

                self.journals[1].author = self.users[0]._id;
                self.journals[1].baby = self.babies[1]._id;

                self.journals[2].author = self.users[1]._id;
                self.journals[2].baby = self.babies[0]._id;

                self.journals[3].author = self.users[1]._id;
                self.journals[3].baby = self.babies[0]._id;

                Meteor.call('fixtures/journals/create', self.journals, journalsCreated);
            }
            function journalsCreated(err,journals){
                //console.log(journals);
                _.each(journals,function(journal,idx){
                    self.journals[idx]._id = journal;
                });
                done();
            }
        });
        afterEach(function(done){
            if(this.sub)
                this.sub.stop();
            Meteor.logout(function(err){
                done();
            })
        });
        function prepare(user,done,callback){
            Meteor.loginWithPassword(user.name,user.password,loginOK);
            function loginOK(err){
                expect(err).toBeUndefined();
                expect(Meteor.userId()).toEqual(user._id);
                if(err){
                    done();
                }else{
                    callback();
                }
            }
        }
        it('returns all journals of all babies ', function (done) {
            var self = this;
            prepare(self.users[0],done,getJournals);

            function getJournals(){
                self.sub = Meteor.subscribe('myViewableJournals',{},{},{onReady:dataReady,onStop:dataError});
                function dataError(err){
                    expect(err).toBeUndefined();
                    done()
                }
                function dataReady(){
                    var journals = Journals.find().fetch();
                    expect(journals.length).toEqual(4);
                    _.each(journals,function(journal,idx){
                        expect(journal.description).toEqual(self.journals[idx].description);
                    }) ;
                    done();
                }
            }

        });
        it('returns all journals of all babies with filter ', function (done) {
            var self = this;
            prepare(self.users[0],done,getJournals);

            function getJournals(){
                self.sub = Meteor.subscribe('myViewableJournals',{},{search:'1'},{onReady:dataReady,onStop:dataError});
                function dataError(err){
                    expect(err).toBeUndefined();
                    done()
                }
                function dataReady(){
                    var journals = Journals.find().fetch();
                    expect(journals.length).toEqual(3);
                    expect(journals[0].description).toEqual(self.journals[0].description);
                    expect(journals[1].description).toEqual(self.journals[2].description);
                    expect(journals[2].description).toEqual(self.journals[3].description);

                    done();
                }
            }

        });
        it('returns all journals of the specified baby', function (done) {
            var self = this;
            prepare(self.users[0],done,getJournals);

            function getJournals(){
                self.sub = Meteor.subscribe('myViewableJournals',{},{baby:self.babies[0]._id},{onReady:dataReady,onStop:dataError});
                function dataError(err){
                    expect(err).toBeUndefined();
                    done()
                }
                function dataReady(){
                    var journals = Journals.find({}).fetch();
                    expect(journals.length).toEqual(3);

                    expect(journals[0].description).toEqual(self.journals[0].description);
                    expect(journals[1].description).toEqual(self.journals[2].description);
                    expect(journals[2].description).toEqual(self.journals[3].description);

                    done();
                }
            }

        });
        it('returns all journals of the specified baby with filter', function (done) {
            var self = this;
            prepare(self.users[0],done,getJournals);

            function getJournals(){
                self.sub = Meteor.subscribe('myViewableJournals',{},{baby:self.babies[0]._id, search:'2'},{onReady:dataReady,onStop:dataError});
                function dataError(err){
                    expect(err).toBeUndefined();
                    done()
                }
                function dataReady(){
                    var journals = Journals.find({}).fetch();
                    expect(journals.length).toEqual(1);

                    expect(journals[0].description).toEqual(self.journals[0].description);

                    done();
                }
            }

        });
        it('returns all journals of all babies for a follower', function (done) {
            var self = this;
            prepare(self.users[2],done,getJournals);

            function getJournals(){
                self.sub = Meteor.subscribe('myViewableJournals',{},{},{onReady:dataReady,onStop:dataError});
                function dataError(err){
                    expect(err).toBeUndefined();
                    done()
                }
                function dataReady(){
                    var journals = Journals.find({}).fetch();
                    expect(journals.length).toEqual(3);

                    expect(journals[0].description).toEqual(self.journals[0].description);
                    expect(journals[1].description).toEqual(self.journals[2].description);
                    expect(journals[2].description).toEqual(self.journals[3].description);

                    done();
                }
            }

        });
    })
});