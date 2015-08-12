var crypto = Npm.require('crypto');
var urlapi = Npm.require('url');


ShareBJ.get_temp_url = function(key, secret, bucket, expires, url){
    parsedUrl = urlapi.parse(url);

    var d = new Date();
    expires = Math.floor(d.getTime()/1000) + expires;

    var stringToSign = 'GET\n\n\n'+expires+'\n' + '/' + bucket + parsedUrl.pathname;
    return url + '?' + 'AWSAccessKeyId=' + key
        + '&' + 'Expires=' + expires
        + '&' + 'Signature=' + encodeURIComponent( crypto.createHmac('SHA1',secret).update(new Buffer(stringToSign,"utf-8")).digest('base64'));
}