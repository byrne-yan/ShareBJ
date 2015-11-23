describe('net',()=>{
    var _isIP =_lib_methods4Testing._isIP;
    var _isPrivateIp =_lib_methods4Testing._isPrivateIp;
    it('validate ipv4 address',()=>{

        expect(_isIP('102.45.23.154')).toBe(true);
        expect(_isIP('1.45.23.154')).toBe(true);
        expect(_isIP('10.45.23.154')).toBe(true);
        expect(_isIP('255.45.23.154')).toBe(true);
    });

    it('validates private ip',()=>{
        expect(_isPrivateIp('127.0.0.1')).toBe(true);
        expect(_isPrivateIp('192.168.0.1')).toBe(true);
        expect(_isPrivateIp('192.168.0.255')).toBe(true);
        expect(_isPrivateIp('193.168.0.1')).toBe(false);
        expect(_isPrivateIp('192.167.0.255')).toBe(false);
        expect(_isPrivateIp('10.0.0.1')).toBe(true);
        expect(_isPrivateIp('10.254.0.1')).toBe(true);
        expect(_isPrivateIp('172.16.0.1')).toBe(true);
        expect(_isPrivateIp('172.31.0.1')).toBe(true);
        expect(_isPrivateIp('172.32.0.1')).toBe(false);
    })
});