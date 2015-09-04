Meteor.publish('myBabies',function(){
    if(!this.userId){
        //throw Meteor.Error('Access Denided','Authorization Required');
        return;
    }

    var uid = this.userId;
    function transform(doc){
        doc.guardiansDetail = Meteor.users.find({_id:{$in:doc.owners}},{
            fields:{username:1, 'profile.name':1, 'profile.avatar':1}}).fetch();
        doc.followersDetail = Meteor.users.find({_id:{$in:doc.followers}},{
            fields:{username:1, 'profile.name':1, 'profile.avatar':1}}).fetch();
        return doc;
    };

    var selector = {owners:uid};
    var options = {sort:[["conceptionDate","desc"],["birth.birthTime","desc"]]};

    var self = this;

    var observer =Babies.find(selector,options).observe({
        added: function (doc) {
            self.added('babies', doc._id, transform(doc));
        },
        changed: function (newDoc, oldDoc) {
            self.changed('babies',newDoc._id, transform(newDoc));
        },
        removed:function(oldDoc){
            self.removed('babies',oldDoc._id);
        }
    }) ;
    self.onStop(function(){
        observer.stop();
    });

    self.ready();
});
Meteor.publish('myFollowingBabies',function(){
    if(!this.userId){
        //throw Meteor.Error('Access Denided','Authorization Required');
        return;
    }

    var uid = this.userId;
    function transform(doc){
        doc.guardiansDetail = Meteor.users.find({_id:{$in:doc.owners}},{
            fields:{username:1, 'profile.name':1, 'profile.avatar':1}}).fetch();
        doc.followersDetail = Meteor.users.find({_id:{$in:doc.followers}},{
            fields:{username:1, 'profile.name':1, 'profile.avatar':1}}).fetch();
        return doc;
    };

    var selector = {followers:uid};
    var options = {sort:[["conceptionDate","desc"],["birth.birthTime","desc"]]};

    var self = this;

    var observer =Babies.find(selector,options).observe({
        added: function (doc) {
            self.added('babies', doc._id, transform(doc));
        },
        changed: function (newDoc, oldDoc) {
            self.changed('babies',newDoc._id, transform(newDoc));
        },
        removed:function(oldDoc){
            self.removed('babies',oldDoc._id);
        }
    }) ;
    self.onStop(function(){
        observer.stop();
    });

    self.ready();
});

Meteor.publish('myGuardianOrFollowingBabies',function(){
    if(!this.userId){
        //throw Meteor.Error('Access Denided','Authorization Required');
        return;
    }

    var uid = this.userId;
    function transform(doc){
        doc.guardiansDetail = Meteor.users.find({_id:{$in:doc.owners}},{
            fields:{username:1, 'profile.name':1, 'profile.avatar':1}}).fetch();
        doc.followersDetail = Meteor.users.find({_id:{$in:doc.followers}},{
            fields:{username:1, 'profile.name':1, 'profile.avatar':1}}).fetch();
        return doc;
    };

    var selector = {$or:[{followers:uid},{owners:uid}]};
    var options = {sort: { conceptionDate: -1, "birth.birthTime": -1}};

    var self = this;

    var observer =Babies.find(selector,options).observe({
        added: function (doc) {
            self.added('babies', doc._id, transform(doc));
        },
        changed: function (newDoc, oldDoc) {
            self.changed('babies',newDoc._id, transform(newDoc));
        },
        removed:function(oldDoc){
            self.removed('babies',oldDoc._id);
        }
    }) ;
    self.onStop(function(){
        observer.stop();
    });

    self.ready();
});


Meteor.publish('allBabies',function(options, extra){
    if(!this.userId){
        //throw Meteor.Error('Access Denided','Authorization Required');
        return;
    }

    var selector = {};
    if(extra && extra.search){
        _.extend(selector,{
            $or:[
                {'name': {'$regex':'.*'+extra.search+'.*','$options':'i' }},
                {nickname: {'$regex':'.*'+extra.search+'.*','$options':'i' }}
            ]
        })
    }

    //console.log('allBabies sub: %j',selector );


    Counts.publish(this,'numOfAllBabies', Babies.find(selector),{noReady:true});

    return Babies.find(selector,  options);

});

Meteor.publish('myRequests', function(){
    if(!this.userId){
        //throw Meteor.Error(403,'Authorization Required');
        return;
    }

    var ownedBabies = Babies.find({owners:this.userId}).fetch();
    var ownedBabyIds = _.map(ownedBabies,function(baby){return baby._id});
    var selector = {baby:{$in: ownedBabyIds}};
    Counts.publish(this,'numOfMyRequests', Requests.find(selector),{noReady:true});

    function transform(doc){
        var requester = Meteor.users.findOne({_id:doc.requester});
        var baby = Babies.findOne({_id:doc.baby});
        doc.requesterDetail = {
            name:requester.username,
            nickname: requester.profile.name,
            avatar:requester.profile.avatar
        };
        doc.babyDetail = {
            name: baby.name,
            nickname: baby.nickname,
            avatar: baby.avatar,
        };
        return doc;
    };

    var self = this;

    var observer =Requests.find(selector).observe({
        added: function (doc) {
            self.added('requests', doc._id, transform(doc));
        },
        changed: function (newDoc, oldDoc) {
            self.changed('requests',newDoc._id, transform(newDoc));
        },
        removed:function(oldDoc){
            self.removed('requests',oldDoc._id);
        }
    }) ;
    self.onStop(function(){
        observer.stop();
    });

    self.ready();
});



