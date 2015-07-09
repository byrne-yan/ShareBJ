Template.journalItem.helpers(
    {
        ownJournal: function() {
            return this.userId === Meteor.userId();
        },
        formatedDate: function() {
            var options = { weekday: "long", year: "numeric", month: "short",
                day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"  };
            return this.submitted.toLocaleString("zh-CN",options);
        }
    }
);

