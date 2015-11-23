ShareBJ.menu.imagesDashboard = 'sbj_images_lib/client/images_menu.ng.html';

angular.module('shareBJ.images')
    .controller('ImagesDashCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){


    }).controller('ImagesSettingsCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){
        if(Meteor.isCordova){

            $timeout(function(){
                Images.cacheManager.storage.getFreeSpace();
            },500);

            $scope.settings = {}

            $scope.$meteorAutorun(function(){
                $scope.storageSettings = Images.cacheManager.storage.settings.findOne();
                console.log('storageSettings updated:',$scope.storageSettings);
                $scope.settings.externalEnable = $scope.storageSettings.externalEnable;
                $scope.settings.internalEnable = $scope.storageSettings.internalEnable;
                $scope.settings.externalFirst = $scope.storageSettings.externalFirst;
                $scope.settings.externalAvailable = $scope.storageSettings.externalAvailable;
                $scope.settings.internalAvailable = $scope.storageSettings.internalAvailable;

                $scope.settings.uploadOrigin = $scope.storageSettings.uploadOrigin;
                $scope.settings.downloadOrigin = $scope.storageSettings.downloadOrigin;

                console.log('$scope.settings:',$scope.settings);
                $timeout(function(){});
            });

            $scope.changeSettings = function(){
              console.log('changeSettings',$scope.settings.externalEnable,$scope.settings.internalEnable,$scope.settings.externalFirst);
                Images.cacheManager.storage.settings.update({}, {
                        $set: {
                            externalEnable: $scope.getReactively('settings.externalEnable'),
                            internalEnable: $scope.getReactively('settings.internalEnable'),
                            externalFirst: $scope.getReactively('settings.externalFirst'),
                            uploadOrigin: $scope.getReactively('settings.uploadOrigin'),
                            downloadOrigin: $scope.getReactively('settings.downloadOrigin')
                        }
                    },
                    function(err,num){
                        console.log('change settings result:',err,num)
                    }
                );
            };

            $scope.doRefresh = function(){
                Images.cacheManager.storage.getFreeSpaceExternal();
                Images.cacheManager.storage.getFreeSpace();
                $timeout(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                },100,false);

            };

            $scope.$meteorAutorun(function(){
                $scope.cacheStat = Images.cacheManager.index.stat.findOne();
                console.log('cacheStat updated:',$scope.cacheStat);
                $timeout(function(){});
            });
        }
    }).controller('ImagesListCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){

        $scope.images = $scope.$meteorCollection(function () {
            return Images.cacheManager.index.indexes.find({},{
                transform:getThumbURI
            });
        },false);

        function getThumbURI(doc){
            var uri = doc.cached_uri;
            doc.thumb = new ReactiveVar(null);
            function getThumb(doc){
                Images.cacheManager.getThumbnailURI(uri)
                .then(function(thumbURI){
                        Images.server.remapuriAsync(thumbURI,function(err,mappedURI){
                            if(!err)
                                doc.thumb.set(mappedURI);
                            else
                                noThumb(err);
                        })
                    },noThumb);
                function noThumb(err){
                    console.log('no thumb, use original image')
                    doc.thumb.set(Images.server.remapuri(uri))
                }
            }
            if(uri)
                getThumb(doc);
            return doc;
        }

/*        $scope.$watchCollection(
            'images',
            function(newValue,oldValue) {
                console.log(newValue);
            },
            true
        );*/

        $scope.showImage = function(index){
            $scope.index  = index;
            $scope.slideModal = $ionicModal.fromTemplate(
                '<sbj-gallery images="images" src="cached_uri" orientation="orientation" start="{{index}}" onclose="closeGallery()"></sbj-gallery>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            $scope.slideModal.show();
        }
        $scope.closeGallery = function(){
            $scope.slideModal.hide();
            $scope.slideModal.remove();
        };
    });