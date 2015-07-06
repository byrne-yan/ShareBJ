Template.babyStatus.helpers(
    {
        nickname: function() {
            return ownBabies(Meteor.userId()).profile.nickname;
        }
    }
);
