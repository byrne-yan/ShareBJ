angular.module('shareBJ.journals')
    .controller('NewJournalCtrl', function ($scope, $rootScope, $state, $stateParams,$cordovaImagePicker,$cordovaCamera
        ,$ionicActionSheet) {
        if($rootScope.currentUser){
            $scope.$meteorSubscribe('myGuardianOrFollowingBabies');
        }
        $scope.babies = $scope.$meteorCollection(function(){
            return Babies.find({$or:[{followers:$rootScope.currentUser._id},{owners:$rootScope.currentUser._id}]},
                {sort: { conceptionDate: -1, "birth.birthTime": -1}});
        },false);
        $scope.journals = $scope.$meteorCollection(Journals);
        $scope.journal = {};
        if ($stateParams.baby) {
            $scope.journal.baby = $stateParams.baby;
        }

        $scope.sending = false;
        $scope.picking = false;
        $scope.journal.images = [];
        var moreImages = 9;

        $scope.newJournal = function(journal){
            $scope.sending = true;
            var journalObj ={
                description:journal.description,
                author:$rootScope.currentUser._id,
                baby: journal.baby,
                images:[],
                createdAt: new Date()
            };

            $scope.journals.save(journalObj)
                .then(function(docIds){
                    console.log("saved journals:", docIds);
                    return Promise.all(_.map($scope.journal.images,function(image){
                        image.uploader = new Slingshot.Upload("imageUploads", {journalId: docIds[0]});
                        console.log("image uploading :", image.filename);

                        var uploading = function(blob){
                            return new Promise(function(resolve,reject){
                                image.uploader.send(blob,function(error,downloadUrl){
                                    if(error)
                                    {
                                        console.log(error);
                                        return reject(error);
                                    }else{
                                        console.log("image uploading :", blob.name,blob.size,blob.type, "done and then updating journal", docIds[0]);
                                        Journals.update({_id: docIds[0]},
                                            {$push:{images:{url:downloadUrl}}},
                                            {},
                                            function(error,num){
                                                if(error){
                                                    console.log("Error updating uploaded image url",error);
                                                    return reject(error);
                                                } else {
                                                    console.log("update journal's images done", docIds[0], num);
                                                    return resolve();
                                                }
                                            }
                                        );
                                    }
                                })
                            })
                        };
                        if(Meteor.isCordova){
                            if(image.dataAsUrl){
                                return uploading(dataURL2Blob(image.dataAsUrl));
                            }else
                            if(!image.file && image.filename)
                            {
                                uri2Blob(image.filename)
                                    .then(function(blob){
                                        return uploading(blob);
                                    })
                            }else{
                                return uploading(image.file);
                            }
                        }else{
                            return uploading(image.file);
                        }
                    }))
                }).then(function(){
                    $scope.sending = false;
                    $state.go(ShareBJ.state.journals);
                }).catch(function(error){
                    console.log(error);
                    $scope.sending = false;
                })
        };
        $scope.pickImages = function(event){
            var images = this.files;
            $scope.picking = true;

            var dedup = _.filter(images, function(image){
                return !_.find($scope.journal.images, function(elm){ return elm.filename === image.name})
            });
            Promise.all(
                _.map(dedup, function(image){
                    //console.log(image);
                    return new Promise(function(resolve,reject){
                        var reader = new FileReader();

                        reader.onloadend =function(){
                            if(reader.error)
                            {
                                console.log("FilerReader error:",reader.error);
                                return reject(reader.error);
                            }else{
                                return resolve({
                                    filename:image.name,
                                    dataAsUrl:reader.result,
                                    file:image
                                })
                            }
                        };
                        moreImages --;
                        if(moreImages<0)
                            return resolve(null);

                        console.log("read image:",image);
                        reader.readAsDataURL(image);
                    })
                })
            )
            .then(function(results){
                $scope.$apply(function(){
                    _.each(results,function(result){
                        console.log(result);
                        if(result)
                            $scope.journal.images.push(result);
                    })
                });
                $scope.picking = false;
            }).catch(function(error){
                console.log(error);
                $scope.picking = false;
            })
        };

        var imagesFacade = document.getElementById("imageFacade");
        var imagesPicker = document.getElementById("imagePicker");
        imagesPicker.addEventListener("change",$scope.pickImages,false);
        imagesFacade.addEventListener("click",function(e){
            e.preventDefault();

            if(!Meteor.isCordova)
            {
                imagesPicker.click();
            }else{

                pictureSource()
                    .then(function(source){
                        switch (source){
                            case 0:　//camera
                                //using $cordovaCamera
                                var options = {
                                    destinationType: Camera.DestinationType.DATA_URL,
                                    targetWidth: 480,
                                    targetWidth: 480,
                                    sourceType:Camera.PictureSourceType.CAMERA
                                };
                                $cordovaCamera.getPicture(options)
                                    .then(function(imageData){
                                        $scope.journal.images.push({
                                            filename:"camera"+ (new Date()),//unique name
                                            dataAsUrl:"data:image/jpeg;base64," + imageData,
                                            file:null
                                        });
                                    }, function(error) {
                                            $scope.picking = false;
                                            console.log("getPictures error:",error);
                                    });
                                break;
                            case 1:
                                //using imagePicker

                                var options = {
                                    maxImages: moreImages,
                                    width: 480,
                                    height: 480,
                                    quality: 80
                                };
                                $scope.picking = true;
                                $cordovaImagePicker.getPictures(options)
                                    .then(function (results) {
                                        for (var i = 0; i < results.length; i++) {
                                            console.log('Image URI: ' + results[i]);
                                            //var url = CordovaFileServer.httpUrl +
                                            //    results[i].substring(cordova.file.applicationStorageDirectory.length-1,results[i].length);
                                            uri2DataURL(results[i])
                                                .then(function(res){
                                                    //var uri = results[i];
                                                    console.log("uri:",res.filename);
                                                    console.log("dataUrl:",res.dataURL);
                                                    $scope.$apply(function(){
                                                        $scope.journal.images.push({
                                                            filename:res.filename,
                                                            dataAsUrl:res.dataURL,
                                                            file:null
                                                        });
                                                    })
                                                })
                                        }
                                        $scope.picking = false;
                                    }, function(error) {
                                        $scope.picking = false;
                                        console.log("getPictures error:",error);
                                    });
                                break
                        }
                    })
            }
        },false);

        //helpers
        function pictureSource(){
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

        function uri2Blob(uri){
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

        function dataURL2Blob(dataurl){
            var arr = dataurl.split(','),
                mime= arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr],{type:mime});
        };

        function uri2DataURL(uri){
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
    });