Meteor.startup(function(){
    Tracker.autorun(function(c){
        console.log(Meteor.status());
        if(Meteor.status().connected){
            HTTP.get('http://api.ipify.org',function(err,result){
                console.log('public ip:',result.content);
                Meteor.call('reports/address',result.content,function(err,res){
                    if(err)
                        console.log(err);
                })
            })
        }
    });
})
