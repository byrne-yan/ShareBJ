_isPrivateIp = function (ip){
    if(ip=='127.0.0.1') return true;
    var parts = ip.split('.');
    if(parts[0]=='10') return true;
    if(parts[0]=='192' && parts[1]=='168') return true;
    if(parts[0]=='172'){
        var n = parseInt(parts[1]);
        return n >= 16 && n <= 31;
    }
    return false;
}
_isIP = function (ip){
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g.test(ip)
}

//for test only
_lib_methods4Testing = {
    _isPrivateIp:_isPrivateIp,
    _isIP:_isIP
};