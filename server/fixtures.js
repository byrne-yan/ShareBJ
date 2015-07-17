Meteor.startup(function() {


    FS.debug = true;
    var userIds = [];
    if (Meteor.users.find().count() == 0) {
        var users = [
            {
                name:"user1",
                nickname:"Byrne Yan",
                email:"byrne.yan@yahoo.com",
                password: "123456",
                role: 'mother'
            },
            {
                name:"user2",
                nickname:"Alice Zhang",
                email:"byrne_yan@yahoo.com",
                password: "123456",
                role: 'father'
            },
            {
                name:"user3",
                nickname:"Jack Chen",
                email:"byrne.jb.yan@gmail.com",
                password: "123456",
                role: 'grand father'
            }
        ];

        _.each(users, function (user) {
            var id = Accounts.createUser({
                username: user.name,
                email: user.email,
                password: user.password,
                profile: {
                    nickname: user.nickname
                }
            });
            userIds.push(id);
        });
    };
    if(Babies.find().count() == 0){
        var babies = [
            {
                name: "Alice",
                nickname: "Sweaty",
                gender: "female",
                birthTime: new Date(1988,10,10,10,10),
                conceptionDate:new Date(1988,10,20),
                birthHeight:50,
                birthWeight:3500,
                id:'43534t45654765',
                siId:'sdfgdfgdf',
                createdAt: new Date()

            },
            {
                name: "Sam",
                nickname: "ToughMan",
                gender: "male",
                birthTime: new Date(1998,12,10,10,10),
                conceptionDate:new Date(1998,12,20),
                birthHeight:65,
                birthWeight:4000,
                id:'6785678967986798',
                siId:'jkouikhuikujh',
                createdAt: new Date()
            }
        ];
        var count = 0;
        _.each(babies, function(baby){
            baby.owners = [userIds[count]];
            baby.followers = [userIds[count+1]];
            ++count;
            Babies.insert(baby);
        });
    }

});