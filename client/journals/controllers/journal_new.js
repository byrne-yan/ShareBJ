angular.module("shareBJ").controller('JournalNewCtrl', ['$scope',
    function($scope){
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
        $scope.send = function(){
            var journal =　{
                description:$scope.description,
                images:[]
            };

            //upload images
            var i = 0;
            _.each($scope.pickedImages, function(image){
                ++i;

                fileObj = Images.insert(image,function(error, fileObj){
                    if(error)
                    {
                        console.log(error);
                    }

                    if(fileObj){
                        console.log("uploading image " + fileObj.uploadProgress() + '%');
                    }
                });
                //fileObj.ownByBaby = currentBaby;
                //console.log(fileObj);
                fileObj.name(i);
                journal.images.push(fileObj);
            });

            console.log(journal.images.length);
            Meteor.call('journalInsert',journal);
            //insert a journal
        }
    }]);