Meteor.publish('myOwnJournals',function(options, extra){

   //find guarded or

   var selector = {
       author:this.userId
   };
   if(extra && extra.baby){
       _.extend(selector,{
           baby:extra.baby
       })
   }
    if(extra && extra.search){
        _.extend(selector,{
             description:{'$regex':'.*'+extra.search+'.*','$options':'i' }
        })
    }

   Counts.publish(this,'numOfMyOwnJournals', Journals.find(selector),{noReady:true});


   var transform = function(doc){
       doc.author = Meteor.users.findOne({_id:doc.author},{fields:{username:1,'profile.name':1,'profile.avatar':1}});
       doc.baby = Babies.findOne({_id:doc.baby});

       doc.images = Images.getPresignedUrls(doc.images);

       if(doc.upvoters){
           doc.upvoters = Meteor.users.find({_id:{$in:doc.upvoters}}, {fields:{username:1,'profile.name':1} }).fetch();
       };
       if(doc.comments){

           doc.comments =  _.map(doc.comments,
               function(comment) {
                   commenter = Meteor.users.findOne({_id:comment.commenter}, {fields:{username:1,'profile.name':1}});
                   comment.commenterName = commenter.profile.name ||commenter.username;
                   return comment;
               })
       }

      return doc;
   };
   var self = this;

   var observer =Journals.find(selector,options).observe({
      added: function (doc) {
         self.added('journals', doc._id, transform(doc));
      },
      changed: function (newDoc, oldDoc) {
         self.changed('journals',newDoc._id, transform(newDoc));
      },
      removed:function(oldDoc){
         self.removed('journals',oldDoc._id);
      }
   }) ;
   self.onStop(function(){
      observer.stop();
   });

   self.ready();
});

Meteor.publish('myJournals',function(options, extra){

    //find guarded or following babies

    var followingBabis = Babies.find({$or:[
        {owners:this.userId},
        {followers:this.userId},
    ]}).fetch();

    followingBabis = _.pluck(followingBabis,'_id');

    console.log('related babies:',followingBabis);

    var selector;

    if(followingBabis.length>0 && !(extra && extra.baby))
    {
        selector =
            {$or:
                [
                    {author:this.userId},
                    {baby:{$in:followingBabis}}
                ]
            }
    }else{
        selector = {author:this.userId}
    }

    if(extra && extra.baby){
        _.extend(selector,{
            baby:extra.baby
        })
    }

    if(extra && extra.search){
        _.extend(selector,{
            description:{'$regex':'.*'+extra.search+'.*','$options':'i' }
        })
    }

    console.log('myJournals sub selector:',selector);

    Counts.publish(this,'numOfMyJournals', Journals.find(selector),{noReady:true});


    var transform = function(doc){
        doc.author = Meteor.users.findOne({_id:doc.author},{fields:{username:1,'profile.name':1,'profile.avatar':1}});
        doc.baby = Babies.findOne({_id:doc.baby});

        doc.images = Images.getPresignedUrls(doc.images);

        if(doc.upvoters){
            doc.upvoters = Meteor.users.find({_id:{$in:doc.upvoters}}, {fields:{username:1,'profile.name':1} }).fetch();
        };
        if(doc.comments){

            doc.comments =  _.map(doc.comments,
                function(comment) {
                    commenter = Meteor.users.findOne({_id:comment.commenter}, {fields:{username:1,'profile.name':1}});
                    comment.commenterName = commenter.profile.name ||commenter.username;
                    return comment;
                })
        }

        return doc;
    };
    var self = this;

    var observer =Journals.find(selector,options).observe({
        added: function (doc) {
            self.added('journals', doc._id, transform(doc));
        },
        changed: function (newDoc, oldDoc) {
            self.changed('journals',newDoc._id, transform(newDoc));
        },
        removed:function(oldDoc){
            self.removed('journals',oldDoc._id);
        }
    }) ;
    self.onStop(function(){
        observer.stop();
    });

    self.ready();
});


