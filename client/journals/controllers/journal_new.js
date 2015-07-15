angular.module("shareBJ").controller('JournalNewCtrl', ['$scope','$ionicModal',
    function($scope,$ionicModal){
        var plusImage = '/images/plus.jpg';
        $scope.pickedImages = [];

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
        $scope.send = function(){
            //upload images
            //insert a journal
        }
    }]);