Accounts.onEmailVerificationLink(function(token,done){
    //console.log("onEmailVerificationLink",token);
    Accounts.verifyEmail(token,function(error){
        op = {
            title:"电子邮件地址验证结果",
            cssClass:'emailVerifyNotify',
            okText:"知道了"
        };

        if(!error){
            op.template = "恭喜你，你的电子邮件地址已成功验证。";
            op.okType ="button-balanced button-full";
        }else{
            op.cssClass = 'assertive';
            op.template = "很遗憾，你的电子邮件验证链接已失效。请重新请求发送验证邮件！";
            op.okType ="button-balanced button-full";
        };

        ShareBJ.users.client.modal.alert(op)
            .then(function(res){
                done();
            });
    })

});

angular.module('shareBJ.users')
.controller('EmailVerifyCtrl',function($scope,$stateParams,$timeout){

    $scope.result = "无效验证令牌";
        $scope.result = "效验中。。。";
                $scope.result = "非常感谢，你的电子邮箱地址已确认完毕！";
})