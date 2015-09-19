//replace private url by pre-signed url
Images.getPresignedUrls = function(images){
  return _.map(images,function(image){
            if(image.url || image.thumb)
            {
                return {
                    thumb: image.thumb?ShareBJ.get_temp_url(Meteor.settings.s3.image.KEY, Meteor.settings.s3.image.SECRET,
                        Meteor.settings.s3.image.bucket,
                        Images.ThumbExpires,
                        image.thumb
                    ):null,
                    url: image.url?ShareBJ.get_temp_url(Meteor.settings.s3.image.KEY, Meteor.settings.s3.image.SECRET,
                        Meteor.settings.s3.image.bucket,
                        Images.ThumbExpires,
                        image.url
                    ):null
                }
            }
            return image;
        });
};

Images.getUploadStats = function(userId){
    if(!userId || !Users.findOne({_id:userId}))
        throw  new Meteor(404,"User not found");

    //TODO: no stats yet
    return {counts: 0, size: 0}
}