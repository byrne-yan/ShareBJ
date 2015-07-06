Template.journalsList.helpers(
    {
        journals: function() {
            return Journals.find({}, {sort: {submitted: -1}});
        }
    }
);
