Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL_CONFIRM'//'USERNAME_AND_EMAIL'
});

Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'nick-name',
        fieldLabel: '昵称',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
            if (!value) {
                errorFunction("请输入你的昵称");
                return false;
            } else {
                return true;
            }
        }
    //},
    //    {
    //        fieldName: 'ownBaby',
    //        fieldLabel: 'own baby',
    //        visible:false
    //    },
    //    {
    //        fieldName: 'followingBabies',
    //        fieldLabel: 'following babies',
    //        visible:false
        //},
        //{
        //    fieldName: 'role',
        //    showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        //    fieldLabel: '与宝宝关系',
        //    showFieldLabel: true,
        //    inputType: 'radio',
        //    radioLayout: 'inline',    // It can be 'inline' or 'vertical'
        //    data: [{                    // Array of radio options, all properties are required
        //        id: 1,                  // id suffix of the radio element
        //        label: '妈妈',          // label for the radio element
        //        value: 'mother',              // value of the radio element, this will be saved.
        //        checked: 'checked'
        //    }, {
        //        id: 2,
        //        label: '爸爸',
        //        value: 'father'
        //    }],
        //    visible: true
        }, {
            fieldName: 'city',
            fieldLabel: '城市',
            inputType: 'select',
            showFieldLabel: true,
            empty: '请选择所在城市',
            data: [{
                id: 1,
                label: '深圳',
                value: 'shenzhen'
            }, {
                id: 2,
                label: '金华',
                value: 'jinhua'
            }],
            visible: true
        }, {
            fieldName:'terms-text',
            fieldLabel:'terms-text',
            inputType:'label',
            readOnly:true,
            fieldPlaceholder:"这是ShareBabyJournal的使用协议文本！",
            visible:"true",
            saveToProfile: false
        },{
            fieldName: 'terms',
            fieldLabel: '我已阅读并同意上述协议',
            inputType: 'checkbox',
            visible: true,
            saveToProfile: false,
            validate: function(value, errorFunction) {
                if (value) {
                    return true;
                } else {
                    errorFunction('你必须接受上述协议');
                    return false;
                }
            }
        }]
});
accountsUIBootstrap3.setLanguage('zh-CN');

Accounts.onLogin(function(){
    Meteor.subscribe("ownBabies",Meteor.userId());
    Meteor.subscribe("followingBabies",Meteor.userId());
});
//fix
accountsUIBootstrap3.map('zh-CN', {
    _enrollAccountDialog: {
        title: '测试抬头'
    }
});

Template.registerHelper(
    'currentBaby', function () {
        var userId = Meteor.userId();
        if (!userId)
            return null;
       return ownBaby(userId);
    }
);