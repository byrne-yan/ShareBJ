//Router.configure({
//    layoutTemplate: 'layout',
//    loadingTemplate: 'loading',
//    notFoundTemplate: 'notFound',
//    waitOn: function() {
//        //return Meteor.subscribe('ownBabies');
//    }
//});
//
//Router.route('/', {name: 'home'});
////Router.route('/journals/:_id', {
////    name: 'journalPage',
////    data: function() { return Journals.findOne(this.params._id); }
////});
//
////Router.route('/journals/:_id/edit', {
////    name: 'journalEdit',
////    data: function() { return Journals.findOne(this.params._id); }
////});
//Router.route('/babies/submit', {
//    name: 'babySubmit',
//    data: function(){return Meteor.subscribe('babies');}
//});
//
//Router.route('/babies/:babyId/edit', {
//    name: 'babyEdit',
//    data: function(){return Babies.findOne({owners:this.params._id})}
//});
//
//Router.route('/journals/submit', {name: 'journalSubmit'});
//
//
////var requireLogin = function() {
////    if (! Meteor.user()) {
////        if (Meteor.loggingIn()) {
////            this.render(this.loadingTemplate);
////        } else {
////            this.render('accessDenied');
////        }
////    } else {
////        this.next();
////    }
////}
////Router.onBeforeAction('dataNotFound', {only: 'journalPage'});
////
////Router.onBeforeAction(requireLogin, {only: 'journalSubmit'});
