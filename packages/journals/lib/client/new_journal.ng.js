angular.module('shareBJ.journals')
    .controller('NewJournalCtrl', function ($scope, $rootScope, $state, $stateParams) {
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
        $scope.newJournal = function(journal){

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
                    _.each($scope.journal.images,function(image){
                        image.uploader = new Slingshot.Upload("imageUploads", {journalId: docIds[0]});
                        console.log("image uploading :", image.filename);
                        image.uploader.send(image.file,function(error,downloadUrl){
                            if(error)
                            {
                                console.log(error);
                            }else{
                                console.log("image uploading :", image.filename, "done and then updating journal", docIds[0]);
                                Journals.update({_id: docIds[0]},
                                    {$push:{images:{url:downloadUrl}}},
                                    {},
                                    function(error,num){
                                        if(error){
                                            console.log("Error updating uploaded image url",error);
                                        } else {
                                            console.log("update journal's images done", docIds[0], num);
                                        }
                                    }
                                );
                            }
                        })
                    });

                    $state.go(ShareBJ.state.journals);
                },function(error){
                    console.log(error);
                })



        };
        $scope.journal.images = [];
        var moreImages = 9;
        $scope.pickImages = function(event){
            var images = this.files;


            _.each(images, function(image){
                if(!_.find($scope.journal.images, function(elm){ return elm.filename === image.name})
                    && moreImages > 0 )
                {
                    var reader = new FileReader();
                    reader.onloadend =function(){
                        console.log(reader.result);
                        $scope.$apply(function(){
                            $scope.journal.images.push({filename:image.name,
                                dataAsUrl:reader.result,
                                file:image
                            });
                        });
                    };
                    moreImages --;
                    reader.readAsDataURL(image);
                }
            })
        };

        var imagesFacade = document.getElementById("imageFacade");
        var imagesPicker = document.getElementById("imagePicker");
        imagesPicker.addEventListener("change",$scope.pickImages,false);
        imagesFacade.addEventListener("click",function(e){
            imagesPicker.click();
            e.preventDefault();
        },false);
    });