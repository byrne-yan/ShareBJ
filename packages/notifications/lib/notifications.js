

function invitationEmailHtml(notification,withUrl){
    var action;
    switch(notification.data.type){
        case 'guard':
            action = "记录";
            break;
        case 'follow':
            action = "分享"
    };

    var invitor = notification.data.invitor;
    var baby = notification.data.baby;

    return "<div class='invitation'>" +
        "<h2 class='invitation-invitee'>亲，</h2>" +
        "<p class='invitation-content'>"+
        "<span class='invitation-invitor'>" + invitor.nickname + '(' + invitor.name + ')</span>'
            //+ "<span class='invitation-date'>" + moment(notification.data.when).format('LL') + "</span>"
        + "邀请您一起<span class='invitation-action'>" + action  + "</span>" +
        "他/她的宝宝<span class='invitation-baby'>" + '(' + (baby.name || baby.nickname)
        + ', ' + (baby.born?ageOf(baby.date)[3]:conceptionAge(baby.date)[2]) + ')' + "</span>"
        + "的成长历程、喜怒哀乐以及各种生活趣事！"
        +'</p>'
        + (withUrl?("<p>请前往消息中心接受邀请！</p>"):'')
        +'</div>';
}

Herald.addCourier('UserInvitation',{
    media:{
        onsite:{},
        email:{
            emailRunner: function(user){
                var notification = this;
                Email.send({
                    from: 'ShareBJ <byrne_yan@yahoo.com>',
                    to: Users.getEmail(user),
                    subject: '邀请一起'+ notification.data.type==='guard'?'记录':'分享' + '宝宝的成长历程',
                    html: invitationEmailHtml(notification,true)
                })
            }
        }
    },
    message: function(){
        var notification = this;

        return invitationEmailHtml(notification,false);
    },
    transform:{}
});

ShareBJ.emailer = {
    sendUserInvitation: function(to, invitation, url){
        var subject = '';

        switch(invitation.type)
        {
            case 'guard':
                subject = '邀请您一起记录宝宝的成长历程';
                break;
            case 'follow':
                subject = '邀请您一起分享宝宝的成长历程';
                break;
            default :
                subject = 'unknown subject';
                break;
        };
        var invitationEmailHtml = function(invitation, url){
            var action;
            switch(invitation.type){
                case 'guard':
                    action = "记录";
                    break;
                case 'follow':
                    action = "分享"
            };

            var invitor = invitation.invitor;
            var baby = invitation.baby;
            return "<div class='invitation'>" +
                "<h2 class='invitation-invitee'>亲，</h2>" +
                "<p class='invitation-content'>"+
                "<span class='invitation-invitor'>" + invitor.nickname + '(' + invitor.name + ')</span>'
                    //+ "<span class='invitation-date'>" + moment(notification.data.when).format('LL') + "</span>"
                + "邀请您一起<span class='invitation-action'>" + action  + "</span>" +
                "他/她的宝宝<span class='invitation-baby'>" + '(' + (baby.name || baby.nickname)
                + ', ' + (baby.born?ageOf(baby.date)[3]:conceptionAge(baby.date)[2]) + ')' + "</span>"
                + "的成长历程、喜怒哀乐以及各种生活趣事！"
                +'</p>'
                + "<p>点击下面链接接受邀请：<a href='" + url + "'>" + url + "</a></p>"
                +'</div>';
        };

        Email.send({
            from: 'ShareBJ <byrne_yan@yahoo.com>',
            to: to,
            subject: subject,
            html: invitationEmailHtml(invitation, url)
        });
    }
};

