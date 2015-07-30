Template.journalEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentJournalId = this._id;

        var journalProperties = {
            title: $(e.target).find('[name=title]').val()
        }
        var errors = validatePost(journalProperties);
        if (errors.title)
            return Session.set('journalSubmitErrors', errors);

        Journals.update(currentJournalId, {$set: journalProperties}, function(error) {
            if (error) {
                // 向用户显示错误信息
                throwError(error.reason);
            } else {
                Router.go('journalPage', {_id: currentJournalId});
            }
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this journal?")) {
            var currentJournalId = this._id;
            Journals.remove(currentJournalId);
            Router.go('journalsList');
        }
    }
});

Template.journalEdit.onCreated(function() {
    Session.set('journalEditErrors', {});
});
Template.journalEdit.helpers({
    errorMessage: function(field) {
        return Session.get('journalEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('journalEditErrors')[field] ? 'has-error' : '';
    }
});