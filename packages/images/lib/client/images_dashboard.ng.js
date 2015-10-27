ShareBJ.menu.imagesDashboard = 'sbj_images_lib/client/images_menu.ng.html';

angular.module('shareBJ.images')
    .controller('ImagesDashCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){


    }).controller('ImagesSettingsCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){
        if(Meteor.isCordova){

            $scope.handle = Meteor.setInterval(function(){
                Images.cacheManager.storage.getFreeSpace();
            },1000);

            $scope.$on('$destroy',function(){
                Meteor.clearInterval($scope.handle );
            });

            $scope.settings = {}

            $scope.$meteorAutorun(function(){
                $scope.storageSettings = Images.cacheManager.storage.settings.findOne();
                console.log('storageSettings updated:',$scope.storageSettings);
                $scope.settings.externalEnable = $scope.storageSettings.externalEnable;
                $scope.settings.internalEnable = $scope.storageSettings.internalEnable;
                $scope.settings.externalFirst = $scope.storageSettings.externalFirst;
                console.log('$scope.settings:',$scope.settings);
                $timeout(function(){});
            });

            $scope.changeSettings = function(){
              console.log('changeSettings',$scope.settings.externalEnable,$scope.settings.internalEnable,$scope.settings.externalFirst);
                Images.cacheManager.storage.settings.update({}, {
                        $set: {
                            externalEnable: $scope.getReactively('settings.externalEnable'),
                            internalEnable: $scope.getReactively('settings.internalEnable'),
                            externalFirst: $scope.getReactively('settings.externalFirst')
                        }
                    },
                    function(err,num){
                        console.log('change settings result:',err,num)
                    }
                );
            };

            $scope.$meteorAutorun(function(){
                $scope.cacheStat = Images.cacheManager.index.stat.findOne();
                console.log('cacheStat updated:',$scope.cacheStat);
                $timeout(function(){});
            });
        }
    }).controller('ImagesListCtrl',function($scope, $meteor, $timeout, $state, $ionicHistory,$ionicModal){

        $scope.images = $scope.$meteorCollection(function () {
            return Images.cacheManager.index.indexes.find();
        });

        $scope.remap = function(uri){
            return Images.server.remapuri(uri);
        }

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