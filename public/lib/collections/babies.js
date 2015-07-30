Babies = new Meteor.Collection("babies");
//schema = new SimpleSchema({
//    name: {
//        type: String,
//        label: "名字",
//        max: 200
//    },
//    nickname: {
//        type: String,
//        label: "小名",
//        min: 2
//    },
//    gender:{
//        type: String,
//        label: "性别",
//        min: 2,
//        max: 2
//    },
//    birthTime: {
//        type: Date,
//        label: "出生日期和时间",
//        optional: true
//    },
//    conceptionDate:{
//        type: Date,
//        label: "受孕日期"
//    },
//    birthHeight:{type: Number,
//        label: "出生时身高",
//        min: 0
//    },
//    birthWeight:{type: Number,
//        label: "出生时体重",
//        min: 0
//    },
//    id:{
//        type: String,
//        label: "身份证",
//        optional: true,
//        max: 13
//    },
//    siId:{
//        type: String,
//        label: "社保号",
//        optional: true,
//        max: 13
//    }
//});
//Babies.attachSchema(schema);

//OwnBabies = new Meteor.Collection("babies");
//FollowingBabies = new Meteor.Collection("babies");

validateBaby = function (baby) {
    var errors = {};
    if (!baby.conceptionDate)
        errors.conceptionDate = "请填写受孕日期";

    return errors;
}

ownBaby = function(ownerID){
    if( !ownerID )
    {
        return null;
    }
    var babies = Babies.find({owners: ownerID});
    if(babies.count()<1)
    {
        return null;
    }
    return Babies.findOne({owners: ownerID});
}
ownBabies = function(ownerID){
    if(ownerID)
    {
        var v = Babies.find({owners: ownerID});
        //console.log('getting own babies:')
        //console.log(ownerID);
        if (v){
            //console.log(v);
            return v;
        }
    }
    return null;
}

followingBabies = function(followerID){
    if(followerID)
    {
        var v = Babies.find({followers: followerID});
        //console.log('getting following babies:')
        //console.log(followerID)
        //console.log(v.count());
        return v;
    }
    return null;
};

Meteor.methods({
    babyInsert: function(babyAttributes) {
        //console.log(babyAttributes);
        check(Meteor.userId(), String);
        check(babyAttributes, {
            name: String,
            nickname: String,
            gender:String,
            conceptionDate:Date,
            birthTime:Date,
            birthHeight:Number,
            birthWeight:Number,
            height:Number,
            weight:Number,
            id:String,
            siId:String
        });

        var errors = validateBaby(babyAttributes);
        if (errors.conceptionDate )
        {
            return  Meteor.Error('invalid-baby;', errors.conceptionDate);
        }

        var user = Meteor.user();
        if(_.isUndefined(user))
        {
            return Meteor.Error('unauthorized user');
        }

        if(!babyAttributes.nickname){
            babyAttributes.nickname = user.username + "宝宝";
        }
        var baby = _.extend(babyAttributes, {
            owners: [user._id],
            followers: [],
            createdAt: new Date()
        });

        //console.log(baby);
        var babyId = Babies.insert(baby);

        console.log("Inserted baby:"+babyId);
        return {
            _id: babyId
        };
    },
    babySave: function(babyAttributes) {
        //console.log(babyAttributes);
        check(Meteor.userId(), String);
        check(babyAttributes, {
            name: String,
            nickname: String,
            gender:String,
            conceptionDate:Date,
            birthTime:Date,
            birthHeight:Number,
            birthWeight:Number,
            height:Number,
            weight:Number,
            id:String,
            siId:String
        });

        var errors = validateBaby(babyAttributes);
        if (errors.conceptionDate )
        {
            return  Meteor.Error('invalid-baby;', errors.conceptionDate);
        }

        var user = Meteor.user();
        if(_.isUndefined(user))
        {
            return Meteor.Error('unauthorized user');
        }

        if(!babyAttributes.nickname){
            babyAttributes.nickname = user.username + "宝宝";
        }

        //console.log(baby);
        var babyId = Babies.update(babyAttributes);

        console.log("modified baby:"+babyId);
        return {
            _id: babyId
        };
    }
});