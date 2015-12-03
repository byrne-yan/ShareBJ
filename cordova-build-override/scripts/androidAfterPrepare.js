module.exports = function(ctx){
    console.log('android after prepare script called');
    if(ctx.opts.platforms.indexOf('android') < 0){
        return;
    }

    var fs = ctx.requireCordovaModule('fs');
    var path = ctx.requireCordovaModule('path');
    var deferral = ctx.requireCordovaModule('q').defer();


    var projectDir = ctx.opts.projectRoot;
    var manifeset = 'platforms/android/AndroidManifest.xml';

    var manifesetPath = path.join(projectDir,manifeset);

    fs.readFile(manifesetPath,'utf8',minifestOnLoad);

    function minifestOnLoad(err,content){
        if(err) {
            deferral.reject(err);
        }else{
            if(!content.match(/<application\s.*(android:largeHeap="true")/))
            {
                //console.log('android:largeHeap is not enanled');
                if(content.match(/<application\s.*(android:largeHeap=.*)/)){
                    content = content.replace(/(.*<application\s.*)(android:largeHeap=)(.*)/,'$1$2"true"');
                }else{
                    content = content.replace(/(.*<application)(.*)/,'$1 android:largeHeap="true"$2');
                }
                fs.writeFile(manifesetPath,content,'utf8',function(err){
                    if(err){
                        deferral.reject(err);
                    }else{
                        deferral.resolve();
                    }
                });
            }else{
                deferral.resolve();
            }
        }
    }

    return deferral.promise;
}