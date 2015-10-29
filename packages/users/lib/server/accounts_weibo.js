var config = {
    service:'weibo',
    clientId:Meteor.settings.Weibo.APP_ID,
    secret:Meteor.settings.Weibo.APP_KEY,
    loginStyle:"popup"
}
if(Meteor.isCordova){
    config = _.extend(config,{
        loginStyle:"redirect"
    })
}
ServiceConfiguration.configurations.upsert(
    {service:'weibo'},
    {
        $set: config
    }
);