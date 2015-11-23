_collectionClients = new Mongo.Collection(null);


Meteor.methods({
    'reports/address':function(clientAddress){
        //console.log('reports/address args:',this.userId,this.connection.id,this.connection.clientAddress,clientAddress);
        check(clientAddress,String);
        check(clientAddress,Match.Where(_isIP));

        if(this.connection==null)
            throw  new Meteor.Error(400,'allowed called on a connected client only');
        var r = _collectionClients.findOne({_id:this.connection.id});
        if(r){
            _collectionClients.update({_id:this.connection.id},{$set:{publicAddress:clientAddress}});
        }else{
            _collectionClients.insert({_id:this.connection.id,publicAddress:clientAddress});
        }

        return this.connection.id;
    }
});

ShareBJ.getPublicIp = (connectionId,clientAddress)=> {
    if (!_isPrivateIp(clientAddress)) return clientAddress;

    var r =  _collectionClients.findOne({_id: connectionId});
    if(r) return r.publicAddress;
    return undefined;
};

ShareBJ.observePublicIp = (connectionId,callback)=>{
    var observer = _collectionClients.find({_id:connectionId}).observe({
        added:(doc)=>{callback(doc.publicAddress)},
        changed:(doc)=>{callback(doc.publicAddress)}
    });

    return observer;
};