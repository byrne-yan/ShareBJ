angular.module("shareBJ").controller('JournalNewCtrl', ['$scope', '$state','$meteor','$q',
    function($scope, $state, $meteor, $q){
        var plusImage = '/images/plus.jpg';
        $scope.pickedImages = [];
        $scope.images = [];

        $scope.pickImages = function($files,$event){
            if($files && $files.length)
            {
                var fs = new FileReader();

                function readFile(index){
                    if(index>=$files.length) return; //done all files
                    var file = $files[index];

                    fs.onload = function(e){
                        $scope.$apply(function() {
                            if($scope.pickedImages.length<=8)
                            {
                                var duplicated = false;

                                _.each($scope.pickedImages,function(image){
                                    if(image === e.target.result)
                                    {
                                        duplicated = true;
                                    }
                                });
                                if(!duplicated)
                                {
                                    $scope.pickedImages.push( e.target.result );
                                    $scope.images.push(file);
                                }else{
                                    console.log("ignore duplicated image:" + file);
                                }
                            }
                        })
                        //read next file
                        readFile(index+1);
                    };

                    fs.readAsDataURL(file);
                }
                readFile(0);
            }
        };

        $scope.publicFor = '公开';
        $scope.uploadImages = [];

        var uploadPrepare = function(callback){
            var deferred = $q.defer();
            var count = 0;

            var total = $scope.pickedImages.length;
            _.each($scope.pickedImages, function(image,index){

                images = [];
                $meteor.call('insertImage',image,function(error, fileObj){
                    if(error)
                    {
                        callback(error, index);
                        console.log(error);
                    }else
                    {
                        console.log("uploading image: " + index);
                    }
                }).then(
                    function(fileObj){
                        console.log('Starting uploading image: ' + index, fileObj);
                        fileObj.name(index+1);
                        fileObj.name('thumb'+(index+1),{store:'thumbs'});
                        images.push(fileObj);

                        count++;
                        if(count === total){
                            deferred.resolve(images);
                        }
                    },
                    function(err){
                        callback(err, index);
                        console.log('Uploading image failed', err);
                        count++;
                        if(count === total){
                            deferred.resolve(images);
                        }
                    }
                );
            });
            return deferred.promise;
        }
        $scope.send = function(){
            //upload images
            uploadPrepare(function(error){
                console.log(error);
            }).then(
                function(images){
                    var journal =　{
                        description:$scope.description,
                        images:[]
                    };

                    console.log(images.length);
                    journal.images = images;
                    //if(images.length < $scope.pickedImages.length){
                    //    journal.sys_commments = ($scope.pickedImages.length-images.length).toString() + "张照片上传失败";
                    //}
                    $meteor.call('insertJournal',journal).then(
                        function(data){
                            console.log('Inserting journal done', data);
                            $state.go('journals');
                        },
                        function(err){
                            console.log('Inserting journal failed', err);
                        }
                    );

                }
            );

        }
    }]);