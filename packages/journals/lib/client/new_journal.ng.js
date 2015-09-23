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
        $scope.edit = {};
        $scope.journal.images = [];

        $ionicModal.fromTemplateUrl('svj_journals_lib/client/addendum_modal.ng.html',{
            scope:$scope,
            animation:'slide-in-up'
        }).then(function(modal){
            $scope.modal = modal;
        });
        $scope.$on('$destroy',function(){
            $scope.modal.remove();
        });

        function calcOldestPhoto(){
            var now = new Date();
            var farDate = _.reduce($scope.journal.images, function(memo,image){
                if(image.exif)
                {
                    var took = new Date(image.exif.DateTime.split(' ')[0].replace(/:/g,'\/'));
                    if( memo > took)
                        return took;
                }
                return memo;
            },now);
            return farDate;
        };

        $scope.dateTaken = function(exifdate){
            return exifdate?exifdate.split(' ')[0].replace(/:/g,'\/'):'';
        };

        $scope.newJournal = function(journal){
            $scope.sending = true;
            var journalObj ={
                description:journal.description,
                author:$rootScope.currentUser._id,
                baby: journal.baby,
                images:[]
            };
            if($scope.edit.isAddendum){
                journalObj.when = $scope.edit.addendumDate;
            };

            $scope.journals.save(journalObj)
                .then(function(docIds){
                    console.log("saved journals:", docIds);
                    $ionicLoading.show('上传照片中...');
                    return Images.uploadThumbs($scope.journal.images,docIds[0],function(resolve,reject,docId,no,downloadUrl){
                        Journals.update({_id: docId},
                            {$push:{images:{
                                no:no,
                                thumb:downloadUrl,
                                url:null
                            }}},
                            {},
                            function(error,affected){
                                if(error){
                                    return reject(error);
                                } else {
                                    console.log("update journal's images done", docId, affected);
                                    return resolve({docId:docId,no:no});
                                }
                            }
                        );
                    });
                }).then(function(res){ //once all thumbs uploaded, starting upload images and then go to journal list
                    console.log(res);
                    $ionicLoading.hide();
                    $scope.sending = false;

                    Images.uploadImages($scope.journal.images,res[0].docId,function(resolve,reject,docId,no,downloadUrl){

                        Meteor.call('updateJournalImageURL', docId, no, downloadUrl, function (error, num) {
                            if (error) {
                                return reject(error);
                            } else {
                                console.log("update journal's images done", docId, num);
                                return resolve({docId: docId, no: no});
                            }
                        });
                    }).then(function(res){
                        console.log('Images upload done:',res);
                    },function(err){
                        console.log(err);
                    });
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
            var moreImages = 9 - $scope.journal.images.length;

            Promise.all(
                _.map(dedup, function(image){
                    //console.log(image);

                    return new Promise(function(resolve,reject){
                        //get thumbnail
                        EXIF.readExifFromFileURI(image,function(exif) {
                            console.log("Image exif:", exif);
                            var doImgProcess = function(exifdata){
                                processImage(image, {maxWidth:Images.ThumbWidth, maxHeight:Images.ThumbHeight,quality: 1,exif:exif}, function (data) {
                                    console.log("processed image:", data);
                                    return resolve({
                                        category: "File",
                                        filename: image.name,
                                        dataAsUrl: data,
                                        file: image,
                                        exif: exifdata
                                    })
                                });
                            };
                            doImgProcess(exif);
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
                        if(result) {
                            $scope.journal.images.push(result);
                        }
                    });
                    var farDate = calcOldestPhoto();
                    //one of photo took more than 3 days,then ask if a journal addendum?
                    if(moment(farDate).add(3,'days').isBefore(new Date())){
                        $scope.tookDate = moment(farDate).format('LL');
                        $scope.askAddendum = true;
                        $scope.edit.isAddendum = true;
                        $scope.edit.addendumDate = farDate;
                    }
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
                                    targetWidth: Images.HighQualityWidth,
                                    targetWidth: Images.HighQualityHeight,
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
                                    //maxImages: 9-$scope.journal.images.length,
                                    maximumImagesCount:9-$scope.journal.images.length,
                                    useOriginal:true,
                                    createThumbnail:true,
                                    //saveToDataDirectory:true,
                                    width: Images.NormalQualityWidth,
                                    height: Images.NormalQualityHeight,
                                    quality: 100
                                };
                                $scope.picking = true;
                                $cordovaImagePicker.getPictures(options)
                                    .then(function (results) {
                                        for (var i = 0; i < results.length; i++) {
                                            function read(uri){
                                                console.log('Image URI: ' + uri);
                                                EXIF.readExifFromFileURI(uri,function(exifdata){
                                                    console.log("Image exif:",exifdata);

                                                    //var thumb_uri = uri.replace(cordova.file.dataDirectory,cordova.file.dataDirectory+'thumb_');
                                                    var thumb_uri = uri.replace(cordova.file.cacheDirectory,cordova.file.cacheDirectory+'thumb_');
                                                    console.log('Thumb URI: ' + thumb_uri);
                                                    //processImage(uri,Images.ThumbWidth,Images.ThumbHeight,1,function(data,exifdata){
                                                    processImage(thumb_uri,{exif:exifdata},function(data){
                                                        console.log("processed image:",data);
                                                        $scope.$apply(function(){
                                                            $scope.journal.images.push({
                                                                category:"URI",
                                                                filename:uri,
                                                                dataAsUrl:data,
                                                                file:uri,
                                                                exif:exifdata
                                                            });
                                                            var farDate = calcOldestPhoto();
                                                            //one of photo took more than 3 days,then ask if a journal addendum?
                                                            if(moment(farDate).add(3,'days').isBefore(new Date())){
                                                                $scope.tookDate = moment(farDate).format('LL');
                                                                $scope.askAddendum = true;
                                                                $scope.edit.isAddendum = true;
                                                                $scope.edit.addendumDate = farDate;
                                                            }

                                                        })
                                                    });
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
                '<sbj-slide-box images="journal.images" thumb="dataAsUrl" src="file" exif="exif" orientation-fix="true" show-trash="true" start="{{slideStart}}" onclose="closeSlides()"></sbj-slide-box>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            $scope.slideModal.show();
        }
    });