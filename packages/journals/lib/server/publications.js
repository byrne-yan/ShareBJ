Meteor.publish('myJournals',function(options, extra){

    //console.log("extra:",extra);
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

