//send notifications every second when in dev
if(Meteor.absoluteUrl().indexOf('localhost') !== -1)
  Herald.settings.queueTimer = 1000;

Meteor.startup(function(){

    //customize client side notificatin collection manipulation
    Herald.collection.deny({
        //update:,
        //remove:,
    });

    //Herald.settings.overrides.email = !Settings.get('emailNotifications',true);
});

