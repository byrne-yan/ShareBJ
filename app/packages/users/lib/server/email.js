Accounts.emailTemplates.siteName = "Share Baby Journal";
Accounts.emailTemplates.from = 'ShareBJ <sharebj@hy-cloud.info>';
Accounts.emailTemplates.verifyEmail = {
        subject:function(user){
                return '电子邮箱地址验证';
            },
        text:function(user,url){
            var t = new Date();
            return  user.username + ":\n\n\t你于"+t+",已经在ShareBJ上注册了此电子邮箱地址。如果确认是你本人所为，点击下面链接验证你的电子邮箱地址:" + url;
        },
        html:function(user,url){
            var t = new Date();
            return "<p><strong>"+ user.username + "</strong>:</p>"+
                "<p>你已于"+t+",在ShareBJ上注册了此电子邮箱地址。如果确认是你本人所为，" +
                "点击下面链接验证你的电子邮箱地址:</p> <a href='"+url+"'>"+url+"</a>";
        }
    };
