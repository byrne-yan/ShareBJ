var crypto = Npm.require('crypto');
var urlapi = Npm.require('url');
var http = Npm.require('http');
ShareBJ.getPublicIp4Dev = function (){
    const res = HTTP.call('get',"https://api.ipify.org?format=json");
    //console.log(res.data);
    return res.data.ip;
}

//ShareBJ.get_temp_url = function(key, secret, bucket, expires, url){
//    parsedUrl = urlapi.parse(url);
//
//    var d = new Date();
//    expires = Math.floor(d.getTime()/1000) + expires;
//
//    var stringToSign = 'GET\n\n\n'+expires+'\n' + '/' + bucket + parsedUrl.pathname;
//    var temp_url =  url + '?' + 'AWSAccessKeyId=' + key
//        + '&' + 'Expires=' + expires
//        + '&' + 'Signature=' + encodeURIComponent( crypto.createHmac('SHA1',secret).update(new Buffer(stringToSign,"utf-8")).digest('base64'));
//    //console.log(url,temp_url);
//    return temp_url;
//}

function getSignatureKey(key,dateStamp,regionName,serviceName){
    //console.log("getSignatureKey:",key,dateStamp,regionName,serviceName);
    const kDate = crypto.createHmac('SHA256',"AWS4"+key).update(new Buffer(dateStamp,"utf-8")).digest();
    const kRegion = crypto.createHmac('SHA256',kDate).update(regionName).digest();
    const kService = crypto.createHmac('SHA256',kRegion).update(serviceName).digest();
    const kSigning = crypto.createHmac('SHA256',kService).update("aws4_request").digest();
    return kSigning;
}
ShareBJ.get_temp_url = function(region, key, secret,session, bucket, expires, url, clientIp){
    parsedUrl = urlapi.parse(url);
    //console.log(parsedUrl);
    const method = 'GET';
    const host = parsedUrl.host;
    const service = 's3';
    const endpoint = parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname;
    var d = new Date();

    const amz_date = moment.utc(d).format('YYYYMMDDTHHmmss')+'Z';
    const datestamp = moment.utc(d).format('YYYYMMDD');

    var canonical_uri =  parsedUrl.pathname;
    //const signed_headers = 'host;x-amz-date;x-amz-security-token';

    const signed_headers = 'host';
    const algorithm = 'AWS4-HMAC-SHA256';
    const credential_scope = datestamp + '/' + region + '/' + service +'/aws4_request';
    var canonical_querystring = parsedUrl.query || '';
    if(canonical_querystring!='') canonical_querystring +='&';
    canonical_querystring += 'X-Amz-Algorithm=' + algorithm;
    canonical_querystring += '&X-Amz-Credential=' + encodeURIComponent(key +'/'+credential_scope);
    canonical_querystring += '&X-Amz-Date=' + amz_date;
    canonical_querystring += '&X-Amz-Expires=' + expires;
    canonical_querystring += '&X-Amz-SignedHeaders=' + signed_headers;
    canonical_querystring += '&x-amz-expect-ip=' + encodeURIComponent(clientIp);
    canonical_querystring += '&x-amz-security-token=' + encodeURIComponent(session);

    const payload_hash = crypto.createHash('SHA256').update('').digest('hex');
    //console.log('payload_hash :',payload_hash);
    //console.log('canonical_uri:'+canonical_uri);

    const canonical_headers = 'host:' + host + '\n'
            //+ 'X-Amz-Date:' + amz_date + '\n'
            //+ 'x-amz-security-token:' + encodeURIComponent(session) + '\n';


    const canonical_request = method + '\n'
        + canonical_uri + '\n'
        + canonical_querystring + '\n'
        + canonical_headers + '\n'
        + signed_headers + '\n'
        //+ payload_hash
        + 'UNSIGNED-PAYLOAD';


    //console.log('canonical_request:'+canonical_request);
    const string_to_sign = algorithm + '\n'
        + amz_date + '\n'
        + credential_scope + '\n'
        + crypto.createHash('SHA256').update(canonical_request).digest('hex');

    //console.log('string_to_sign:'+string_to_sign);
    const signing_key = getSignatureKey(secret,datestamp,region,service);
    const signature = crypto.createHmac('SHA256',signing_key).update(new Buffer(string_to_sign,'utf-8')).digest('hex');

    canonical_querystring += '&X-Amz-Signature=' + signature;

    //console.log(endpoint,canonical_querystring)
    const request_url = endpoint + "?" + canonical_querystring;

    //console.log(request_url);
    return request_url;
}