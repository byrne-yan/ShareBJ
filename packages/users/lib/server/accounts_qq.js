var config = {
    service:'qq',
    clientId:Meteor.settings.QQ.APP_ID,
    scope:'get_user_info',
    secret:Meteor.settings.QQ.APP_KEY,
    loginStyle:"popup"
}
if(Meteor.isCordova){
    config = _.extend(config,{
        loginStyle:"redirect"
    })
}
ServiceConfiguration.configurations.upsert(
    {service:'qq'},
    {
        $set: config
    }
);