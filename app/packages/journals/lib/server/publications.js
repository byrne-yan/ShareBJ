/*
Meteor.publish('myOwnJournals',function(options, extra){

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

       var connID = this.connection.id;
       var connClientAddress = this.connection.clientAddress;
       const ip = ShareBJ.getPublicIp(connID,connClientAddress);

       if(ip)
       {
           console.time('Images.getPresignedUrls');
           doc.images = Images.getPresignedUrls(doc.images,ip);
           console.timeEnd('Images.getPresignedUrls');
       }
       else{
           doc.images = [];
       }


       //console.log("images after signing",doc.images);
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

    var observer2 = ShareBJ.observePublicIp(this.connection.id,(publicAddress)=>{
        Journals.find(selector,options).forEach((doc)=>{
            if(doc.images.length>0)
                self.changed('journals',doc._id,transform(doc));
        })
    });
   self.onStop(function(){
       observer2.stop();
      observer.stop();
   });

   self.ready();
});
*/

/**
 * Viewable logic:
 *      all journals for babies whom visitor follows or guardians
 *      all journals visitor wrote
 */
Meteor.publish('myViewableJournals',function(options, extra){
    if(!this.userId) return;
    var self = this;

    var selector = { $or: [{author:self.userId}] }; //author

    var visitor = Meteor.users.findOne({_id:this.userId});
    var relatedBabiesSelector = visitor.isAdmin?{}:{$or:[   {owners:self.userId},  {followers:self.userId} ] };
    var followingBabies = Babies.find(relatedBabiesSelector).fetch();
    followingBabies = _.pluck(followingBabies,'_id');

    if(followingBabies.length>0 && !(extra && extra.baby))
    {
        selector['$or'].push({baby:{$in:followingBabies}});
    }

    if(extra && extra.baby){
        selector ={
            baby:extra.baby
        };
    }

    if(extra && extra.search){
        _.extend(selector,{
            description:{'$regex':'.*'+extra.search+'.*','$options':'i' }
        })
    }

    console.log('myViewableJournals:',followingBabies,selector,options);

    //selector = {};

    Counts.publish(self,'numOfMyViewableJournals', Journals.find(selector),{noReady:true});

    var connID = self.connection.id;
    var connClientAddress = self.connection.clientAddress;
    var transform = function(doc){
        doc.author = Meteor.users.findOne({_id:doc.author},{fields:{username:1,'profile.name':1,'profile.avatar':1}});
        doc.baby = Babies.findOne({_id:doc.baby});

        const ip = ShareBJ.getPublicIp(connID,connClientAddress);
        if(ip)
        {
            //console.time('Images.getPresignedUrls');
            doc.images = Images.getPresignedUrls(doc.images,ip);
            //console.timeEnd('Images.getPresignedUrls');
        }
        else　{
            doc.images = [];
        }

        //console.log("images after sigining:",doc.images);
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

    //watch client public change
    var observer2 = ShareBJ.observePublicIp(self.connection.id,(publicAddress)=>{
        Journals.find(selector,options).forEach((doc)=>{
            if(doc.images && doc.images.length>0)
                self.changed('journals',doc._id,transform(doc));
        })
    });

    self.onStop(function(){
        observer2.stop()
        observer.stop();
    });

    self.ready();
});


