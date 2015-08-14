Meteor.publish('myBabies',function(){
    if(!this.userId){
        throw Meteor.Error('Access Denided','Authorization Required');
    }

    return Babies.find({owners:this.userId},{sort:[["conceptionDate","desc"],["birth.birthTime","desc"]]});
});

Meteor.publish('allBabies',function(options, extra){
    if(!this.userId){
        throw Meteor.Error('Access Denided','Authorization Required');
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

    Counts.publish(this,'numOfAllBabies', Babies.find(selector),{noReady:true});

    return Babies.find(selector,  options);

});

Meteor.publish('myRequests', function(){
    if(!this.userId){
        throw Meteor.Error('Access Denided','Authorization Required');
    }

    var ownedBabies = Babies.find({owners:this.userId}).fetch();
    var ownedBabyIds = _.reduce(ownedBabies,function(memo,baby){
        memo.push(baby._id);
        return memo
    },[]);
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