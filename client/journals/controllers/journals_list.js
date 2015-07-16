//Template.journalsList.helpers(
//    {
//        journals: function() {
//            return Journals.find({}, {sort: {submitted: -1}});
//        }
//    }
//);

angular.module("shareBJ").controller('JournalsListCtrl', ['$scope','$meteor','$state','$ionicModal',
    function($scope,$meteor,$state,$ionicModal){


         $scope.logout = function(){
            Meteor.logout(function(error){
                if(error){
                    console.log(error);
                }else{
                    $state.go('login');
                }
            })
        },
        $scope.postDateAbout = function(createAt){
            var now = new Date();
            var n1 = createAt.getTime();
            var n2 = now.getTime();
            if (n2-n1<60*60*1000) {
                return parseInt((n2-n1)/(60*1000)) + '分钟前';
            }else if (n2-n1<24*60*60*1000){
                return parseInt((n2-n1)/(60*60*1000)) + '小时前';
            }else if(n2-n1<48*60*60*1000){
                return "昨天";
            }else if(n2-n1<96*60*60*1000){
                return "前天";
            }
            return parseInt((n2-n1)/(24*60*60*1000))+'天前';
        },
         $scope.journals = function (){
             Meteor.subscribe("images",currentBaby);
             Meteor.subscribe('journals',currentBaby);
         };
        //$scope.journals = [
        //    {
        //        'description': '这是芋头的第一篇日记',
        //        'author':{
        //            name:'颜俊标',
        //            avatar:'images/mmexport1425360414105.jpeg'
        //        },
        //        'images':[
        //            {
        //                url:'images/mmexport1425360423996.jpeg',
        //                uploadAt: new Date(2014,10,10)
        //            }
        //        ],
        //        createAt: new Date(2015,6,7,9,30)
        //    },
        //    {
        //        'description': '这是芋头的第二篇日记这是芋头的第二篇日记这是芋头的第二篇日记这是芋头的第二篇日记这是芋头' +
        //        '的第二篇日记这是芋头的第二篇日记这是芋头的第二篇日记这是芋头的第二篇日记这是芋头的第二篇日记',
        //        'author':{
        //            name:'颜俊标',
        //            avatar:'images/mmexport1425360414105.jpeg'
        //        },
        //        'images':[
        //            {
        //                url:'images/mmexport1425360423996.jpeg',
        //                uploadAt: new Date(2014,10,10)
        //            },
        //            {
        //                url:'images/mmexport1425360423996.jpeg',
        //                uploadAt: new Date(2014,10,10)
        //            }
        //
        //        ],
        //        createAt: new Date(2015,6,5,11,20)
        //    },
        //    {
        //        'description': '这是芋头的第三篇日记',
        //        'author':{
        //            name:'颜俊标',
        //            avatar:'images/mmexport1425360414105.jpeg'
        //        },
        //        'images':[
        //            {
        //                url:'images/mmexport1425360423996.jpeg',
        //                uploadAt: new Date(2014,10,10)
        //            },
        //            {
        //                url:'images/mmexport1425360423996.jpeg',
        //                uploadAt: new Date(2014,10,10)
        //            },
        //            {
        //                url:'images/mmexport1425360423996.jpeg',
        //                uploadAt: new Date(2014,10,10)
        //            }
        //        ],
        //        createAt: new Date(2015,6,6,14,20)
        //    },
        //];

    }]);