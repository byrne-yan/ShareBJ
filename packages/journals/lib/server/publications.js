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
      //replace private url by pre-signed url
      doc.images = _.map(doc.images,function(image){
         if(image.url || image.thumb)
         {
            return {
               thumb: image.thumb?ShareBJ.get_temp_url(Meteor.settings.s3.image.KEY, Meteor.settings.s3.image.SECRET,
                    Meteor.settings.s3.image.bucket,
                    60 * 60, //one hour expires
                    image.thumb
               ):null,
               url: image.url?ShareBJ.get_temp_url(Meteor.settings.s3.image.KEY, Meteor.settings.s3.image.SECRET,
                   Meteor.settings.s3.image.bucket,
                   60 * 60, //one hour expires
                   image.url
               ):null
            }
         }
         return image;
      });
       if(doc.upvoters){
           doc.upvoters = Meteor.users.find({_id:{$in:doc.upvoters}}, {fields:{username:1,'profile.name':1} }).fetch();
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

