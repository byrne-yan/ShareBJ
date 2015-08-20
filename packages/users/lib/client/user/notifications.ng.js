angular.module('shareBJ.users')
    .controller('NotificationsCtrl', function($scope,$state) {
        $scope.notifications = $scope.$meteorCollection(function(){
            return Herald.getNotifications({medium:'onsite'});
        });

        $scope.moment = moment;

        $scope.msg  = function(notification){
            return notification.message();
        };

        $scope.markAsRead = function(notification){
            Herald.collection.update(notification._id,{$set: {read:true}});
        };

        $scope.acceptInvitation =function(notification){
            $state.go('shareBJ.babies.invitation',{token:notification.data.token,
                invitor:notification.data.invitor.userId,
                baby:notification.data.baby.babyId
            });
            $scope.markAsRead(notification);
        };

        $scope.rejectInvitation =function(notification){
            $scope.markAsRead(notification);
        };
    });