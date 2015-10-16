angular.module('shareBJ.journals')
    .controller('NewJournalCtrl', function ($scope, $rootScope, $state, $stateParams,$timeout,
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
        $scope.journal.imagesCount = 0;

        $scope.$meteorAutorun(function(){
            var desc = $scope.getReactively('journal.description');
            var imagesCount = $scope.getReactively('journal.imagesCount',false);
            //console.log(images.length);
            $scope.hasContent = (!!desc && desc.length > 0) || (!!imagesCount && imagesCount > 0 );
            $timeout(function(){});
        });

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
                    return Images.uploadThumbs($scope.journal.images,docIds[0]._id,journal.baby,function(resolve,reject,docId,no,downloadUrl,babyId){
                        Journals.update({_id: docId},
                            {$push:{images:{
                                no:no,
                                orientation:$scope.journal.images[no].origin.orientation,
                                thumb:downloadUrl,
                                url:null
                            }}},
                            {},
                            function(error,affected){
                                if(error){
                                    return reject(error);
                                } else {
                                    console.log("update journal's images done", docId, affected);
                                    return resolve({docId:docId,babyId:babyId,no:no});
                                }
                            }
                        );
                    });
                }).then(function(res){ //once all thumbs uploaded, starting upload images and then go to journal list
                    console.time('save journal');
                    console.log(res);
                    $ionicLoading.hide();
                    $scope.sending = false;

                    Images.uploadImages($scope.journal.images,res,function(resolve,reject,docId,no,downloadUrl){

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

                    Images.uploadOrigins($scope.journal.images,res,function(resolve,reject,docId,no,downloadUrl){
                        Meteor.call('updateJournalImageURL', docId, no, downloadUrl,false, function (error, num) {
                            if (error) {
                                return reject(error);
                            } else {
                                console.log("update journal's original images done", docId, num);
                                return resolve({docId: docId, no: no});
                            }
                        });
                    });

                    console.timeEnd('save journal');
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
                    var objImage = new UpImage();
                    return new Promise(function(resolve,reject){
                        objImage.attachFile(image)
                            .then(function(){
                                resolve(objImage);
                                moreImages --;
                                if(moreImages<0)//ignore rest
                                    resolve(null);
                        })
                        .catch(function(err){
                                reject(err);
                        })
                    })
                })
            ).then(function(results){
                _.each(results,function(result){
                    //console.log(result);
                    if(result) {
                        $timeout(function(){
                            $scope.journal.images.push(result);
                            $scope.journal.imagesCount++;
                        })
                    }
                });

                var farDate = calcOldestPhoto();
                //one of photo took more than 3 days,then ask if a journal addendum?
                if(moment(farDate).add(3,'days').isBefore(new Date())){
                    $timeout(function() {
                        $scope.tookDate = moment(farDate).format('LL');
                        $scope.askAddendum = true;
                        $scope.edit.isAddendum = true;
                        $scope.edit.addendumDate = farDate;
                    })
                }
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
                        var limits = Session.get('UploadLimits');

                        switch (source){
                            case 0:　//camera
                                //using $cordovaCamera
                                var type = Camera.DestinationType.FILE_URI;

                                var options = {
                                    destinationType: type,
                                    targetWidth: Images.HighQualityWidth,
                                    targetWidth: Images.HighQualityHeight,
                                    sourceType:Camera.PictureSourceType.CAMERA,
                                    saveToPhotoAlbum:false,
                                    correctOrientaton:false,
                                    allowEdit:false
                                };
                                $cordovaCamera.getPicture(options)
                                .then(function(res){
                                    var image = new UpImage();

                                    var done;
                                    if(type === Camera.DestinationType.DATA_URL)
                                    {
                                        var dataURI = "data:image/jpeg;base64," + res;
                                        done = image.attachDataURL(dataURI);
                                    }else{
                                        done = image.attachURI(res);
                                    }

                                    done.then(function(promiseScale){
                                        $timeout(function() {
                                            $scope.journal.images.push(image);
                                            $scope.journal.imagesCount++;
                                        });
                                    }).catch(function(err){
                                        throw err;
                                    });

                                }, function(error) {
                                        $scope.picking = false;
                                        console.log("getPictures error:",error);
                                });
                                break;
                            case 1: //using imagePicker
                                var options = {
                                    //maxImages: 9-$scope.journal.images.length,
                                    maximumImagesCount:9-$scope.journal.images.length,
                                    useOriginal:true,
                                    createThumbnail:false
                                    //saveToDataDirectory:true,
                                    //width: scaleWidth,
                                    //height: scaleHeight,
                                    //quality: quality
                                };
                                $scope.picking = true;
                                $cordovaImagePicker.getPictures(options)
                                .then(function (results) {
                                    var composeImage = function(uri,exifdata){
                                        var image = new UpImage();
                                        image.attachURI(uri).then(function(promiseScale){
                                            $timeout(function () {
                                                $scope.journal.images.push(image);
                                                $scope.journal.imagesCount++;
                                                var farDate = calcOldestPhoto();
                                                //one of photo took more than 3 days,then ask if a journal addendum?
                                                if (moment(farDate).add(3, 'days').isBefore(new Date())) {
                                                    $scope.tookDate = moment(farDate).format('LL');
                                                    $scope.askAddendum = true;
                                                    $scope.edit.isAddendum = true;
                                                    $scope.edit.addendumDate = farDate;
                                                }
                                            })
                                        })
                                    }

                                    for (var i = 0; i < results.length; i++) {
                                        composeImage(results[i]);
                                    }
                                    $scope.picking = false;
                                }, function(error) {
                                    $scope.picking = false;
                                    console.error("getPictures error:",error);
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
            $scope.slideStart = index;
            $scope.slideModal = $ionicModal.fromTemplate(
                '<sbj-slide-box images="journal.images" thumb="thumb.url" src="origin.uri" ' +
                'orientation="origin.orientation" show-trash="true" start="{{slideStart}}"' +
                ' onclose="closeSlides()"></sbj-slide-box>',
                {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            $scope.slideModal.show();
        }
    });