angular.module('shareBJ.journals')
    .controller('NewJournalCtrl', function ($scope, $rootScope, $state, $stateParams,
                                            $cordovaImagePicker,$cordovaCamera,$ionicModal,$ionicLoading
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

            var uploading = function(uploader,blob,docId,no,options){
                return new Promise(function(resolve,reject){
                    uploader.send(blob,function(error,downloadUrl){
                        if(error)
                        {
                            return reject(error);
                        }else{
                            console.log("image uploaded :", blob.name,blob.size,blob.type,
                                "done and then updating journal", docId,"downloadurl",downloadUrl);
                            function handler(error,num){
                                if(error){
                                    return reject(error);
                                } else {
                                    console.log("update journal's images done", docId, num);
                                    return resolve({docId:docId,no:no});
                                }
                            }
                            console.log("options:",options);
                            if(options && options.thumb==false){
                                console.log("done uploading image:",docId,no);
                                Meteor.call('updateJournalImageURL',docId,no,downloadUrl,handler);
                            }else{
                                Journals.update({_id: docId},
                                    {$push:{images:{
                                        no:no,
                                        thumb:downloadUrl,
                                        url:null
                                    }}},
                                    {},
                                    handler
                                );
                            }
                        }
                    })
                })
            };

            $scope.journals.save(journalObj)
                .then(function(docIds){
                    console.log("saved journals:", docIds);
                    $ionicLoading.show('上传照片中...');
                    return Promise.all(_.map($scope.journal.images,function(image,idx){
                        var uploaderThumb = new Slingshot.Upload("thumbUploads", {journalId: docIds[0]});
                        console.log("image uploading #"+idx, image.filename,image.file);

                        return uploading(uploaderThumb,ShareBJ.dataURL2Blob(image.dataAsUrl),docIds[0],idx,{thumb:true});
                    }))
                }).then(function(res){
                    console.log(res);
                    $ionicLoading.hide();
                    $scope.sending = false;
                    //upload original photo
                    var startUpload = function(){
                        var uploaderPromise = Promise.all(_.map($scope.journal.images,function(image,idx){
                            var uploaderImage = new Slingshot.Upload("imageUploads", {journalId: res[idx].docId});
                            console.log("image uploading :", image.filename);

                            processImage(image.file,450,800,1,function(dataURI){
                                return uploading(uploaderImage,ShareBJ.dataURL2Blob(dataURI),res[idx].docId,idx,{thumb:false});
                            });
                        }));
                        console.log('push into session:',uploaderPromise);
                        Session.set('ImageUploaderPromise',uploaderPromise);
                        return uploaderPromise;
                    };

                    var uploaderPromise = Session.get('ImageUploaderPromise');//check last upload done
                    console.log(uploaderPromise);
                    if(!uploaderPromise || !(uploaderPromise instanceof Promise))
                    {
                        startUpload().then(function(res){
                            console.log(res);
                        });
                    }else{
                        console.log(uploaderPromise);
                        uploaderPromise.then(startUpload,startUpload).then(function(res){
                            console.log(res);
                        });
                    }

                    $state.go(ShareBJ.state.journals);
                }).catch(function(error){
                    $ionicLoading.hide();
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
                        //get thumbnail
                        processImage(image,96,96,1,function(data){
                            console.log("processed image:",data);
                            return resolve({
                                category:"File",
                                filename:image.name,
                                dataAsUrl:data,
                                file:image
                            })
                        });
                        moreImages --;
                        if(moreImages<0)//ignore rest
                            return resolve(null);
                    })
                })
            )
            .then(function(results){
                $scope.$apply(function(){
                    _.each(results,function(result){
                        //console.log(result);
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

                ShareBJ.pictureSource($ionicActionSheet)
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
                                        var dataURI = "data:image/jpeg;base64," + imageData;
                                        $scope.journal.images.push({
                                            category:"DataURL",
                                            filename:"camera"+ (new Date()),//unique name
                                            dataAsUrl:dataURI,
                                            file:dataURI
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
                                    width: 450,
                                    height: 800,
                                    quality: 100
                                };
                                $scope.picking = true;
                                $cordovaImagePicker.getPictures(options)
                                    .then(function (results) {
                                        for (var i = 0; i < results.length; i++) {
                                            function read(uri){
                                                console.log('Image URI: ' + uri);
                                                processImage(uri,96,96,1,function(data){
                                                    console.log("processed image:",data);
                                                    $scope.$apply(function(){
                                                        $scope.journal.images.push({
                                                            category:"URI",
                                                            filename:uri,
                                                            dataAsUrl:data,
                                                            file:uri
                                                        });
                                                    })
                                                });
                                            };
                                            read(results[i]);
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

        $scope.closeSlides = function(){
            $scope.slideModal.hide();
            $scope.slideModal.remove();
        };

        $scope.showSlides = function(index){
            //console.log($scope.journal.images);
            $scope.slideStart = index;
            $scope.slideModal = $ionicModal.fromTemplate(
                '<sbj-slide-box images="journal.images" thumb="dataAsUrl" src="file" start="{{slideStart}}" onclose="closeSlides()"></sbj-slide-box>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            $scope.slideModal.show();
        }
    });