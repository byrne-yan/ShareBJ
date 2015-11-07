#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

console.log("after prepare hook",process.argv);

//load config-sample.xml
var projectDir = process.argv[2];
var manifeset = 'platforms/android/AndroidManifest.xml';

var manifesetPath = path.join(projectDir,manifeset);

var content = fs.readFileSync(manifesetPath,'utf8');

if(!content.match(/<application\s.*(android:largeHeap="true")/))
{
    console.log('android:largeHeap is not enanled');
    if(content.match(/<application\s.*(android:largeHeap=.*)/)){
        content = content.replace(/(.*<application\s.*)(android:largeHeap=)(.*)/,'$1$2"true"');
    }else{
        content = content.replace(/(.*<application)(.*)/,'$1 android:largeHeap="true"$2');
    }
}

fs.writeFileSync(manifesetPath,content,'utf8');