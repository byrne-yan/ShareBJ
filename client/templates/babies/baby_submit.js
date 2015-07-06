Template.babyForm.helpers({

});

Template.babySubmit.events({
    'submit form': function (e) {
        e.preventDefault();
        var baby = {
            name: $(e.target).find('[name=name]').val(),
            nickname: $(e.target).find('[name=nickname]').val(),
            gender: $(e.target).find('[name=gender]').val(),
            birthTime: $(e.target).find('[name=birth]').val(),
            conceptionDate:$(e.target).find('[name=conception]').val(),
            birthHeight:parseInt($(e.target).find('[name=height]').val()),
            birthWeight:parseInt($(e.target).find('[name=weight]').val()),
            id:$(e.target).find('[name=id]').val(),
            siId:$(e.target).find('[name=siId]').val()
        };
        Meteor.call('babyInsert', baby, function(error, result) {
            if (error)
                return throwError(error.reason);
            Router.go('home');
        });
    }
});

Template.babyEdit.events({
    'submit form': function (e) {
        e.preventDefault();
        var baby = {
            name: $(e.target).find('[name=name]').val(),
            nickname: $(e.target).find('[name=nickname]').val(),
            gender: $(e.target).find('[name=gender]').val(),
            birthTime: $(e.target).find('[name=birth]').val(),
            conceptionDate:$(e.target).find('[name=conception]').val(),
            birthHeight:parseInt($(e.target).find('[name=height]').val()),
            birthWeight:parseInt($(e.target).find('[name=weight]').val()),
            id:$(e.target).find('[name=id]').val(),
            siId:$(e.target).find('[name=siId]').val()
        };
        Meteor.call('babySave', baby, function(error, result) {
            if (error)
                return throwError(error.reason);
            Router.go('home');
        });
    }
});