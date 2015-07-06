Template.journalSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var journal = {
            title: $(e.target).find('[name=title]').val()
        };
        var errors = validatePost(journal);
        if (errors.title)
            return Session.set('journalSubmitErrors', errors);

        Meteor.call('journalInsert', journal, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            Router.go('journalPage', {_id: result._id});
        });


    }
});

Template.journalSubmit.onCreated(function() {
    Session.set('journalSubmitErrors', {});
});
Template.journalSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('journalSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('journalSubmitErrors')[field] ? 'has-error' : '';
    }
});