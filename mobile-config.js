App.info({
   id:"info.hy-cloud.sharebj",
    name: 'sharebj',
    description: 'Shared Baby Journals',
    version:'0.1.0',
    author: 'Byrne Yan',
    email: 'yanjb@hy-cloud.info',
    website: 'http://sharebj.hy-cloud.info'
});
App.setPreference('AllowInlineMediaPlayback',true);

App.setPreference('android-windowSoftInputMode',"stateVisible|adjustResize");
//
App.accessRule("*");

App.icons({
    //iphone:'resource/icons/icon-60x60.png',
    //iphone_2x:'resource/icons/icon-60x60@2x.png',
    //iphone_3x:'resource/icons/icon-60x60@3x.png',
    //ipad:'resource/icons/icon-76x76.png',
    //ipad_2x:'resource/icons/icon-76x76@2x.png',

    android_ldpi:'resources/icons/icon-36x36.png',
    android_mdpi:'resources/icons/icon-48x48.png',
    android_hdpi:'resources/icons/icon-72x72.png',
    android_xhdpi:'resources/icons/icon-96x96.png'
});

App.launchScreens({
    //iphone:'resources/splash/splash-320x480.png',
    //iphone_2x:'resources/splash/splash-320x480@2x.png',
    //iphone5:'resources/splash/splash-320x568@2x.png',
    //iphone6:'resources/splash/splash-375x667@2x.png',
    //iphone6p_portrait:'resources/splash/splash-414x736@3x.png',
    //iphone6p_landscape:'resources/splash/splash-736x414@3x.png',
    //ipad_portrait:'resources/splash/splash-768x1024.png',
    //ipad_portrait_2x:'resources/splash/splash-768x1024@2x.png',
    //ipad_landscape:'resources/splash/splash-1024x768.png',
    //ipad_landscape_2x:’resources/splash/splash-1024x768@2x.png‘,

    android_ldpi_portrait:'resources/splash/splash-200x320.png',
    android_ldpi_landscape:'resources/splash/splash-320x200.png',
    android_mdpi_portrait:'resources/splash/splash-320x480.png',
    android_mdpi_landscape:'resources/splash/splash-480x320.png',
    android_hdpi_portrait:'resources/splash/splash-480x800.png',
    android_hdpi_landscape:'resources/splash/splash-800x480.png',
    android_xhdpi_portrait:'resources/splash/splash-720x1280.png',
    android_xhdpi_landscape:'resources/splash/splash-1280x720.png'
});