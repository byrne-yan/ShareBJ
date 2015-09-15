ShareBJ.pictureSource = function ($ionicActionSheet){
    return new Promise(function(resolve,reject){
        $ionicActionSheet.show({
            buttons:[
                {text:'<span class="positive">拍摄照片</span>'},
                {text:'<span class="positive">从相册中选取</span>'}
            ],
            //titleText:'获取照片',
            buttonClicked: function(index){
                resolve(index);
                return true;
            },
            cssClass:'image-action-sheet'
        })
    })
};

ShareBJ.uri2Blob = function (uri){
    return new Promise(function(resolve,reject){
        window.resolveLocalFileSystemURL(uri,function(fileEntry){
            fileEntry.file(function(file){
                return resolve(file);
            },function(error){
                return reject(error);
            })
        },function(error){
            return reject(error)
        })
    })
};

ShareBJ.dataURL2Blob = function (dataurl,name){
    //console.log(dataurl);
    var arr = dataurl.split(','),
        mime= arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr],{type:mime,name:name || ''});
};

ShareBJ.uri2DataURL = function (uri){
    return new Promise(function(resolve,reject){
        window.resolveLocalFileSystemURL(uri,function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(result){
                    if(reader.error){
                        return reject(reader.error);
                    }
                    return resolve({dataURL:reader.result,filename:file.name});
                };
                reader.readAsDataURL(file);
            },function(error){
                return reject(error);
            })
        },function(error){
            return reject(error)
        })
    })
};

ShareBJ.blob2DataURL = function(blob){
    return new Promise(function(resolve,reject) {
        var reader = new FileReader();
        reader.onloadend = function (result) {
            if (reader.error) {
                return reject(reader.error);
            }
            return resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
}