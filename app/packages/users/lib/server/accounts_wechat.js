if(Meteor.settings.Wechat)
{
    ServiceConfiguration.configurations.upsert(
        {service:'wechat'},
        {
            $set: {
                service:'wechat',
                clientId:Meteor.settings.Wechat.APP_ID,
                scope:'basic',
                secret:Meteor.settings.Wechat.APP_KEY
            }
        }
    );
}