describe "sbj:users", ->
#  $meteor = null
#  $rootScope =null
#
#  beforeEach angular.mock.module 'shareBJ.users'
#
#  beforeEach ->
#    Accounts.createUser username:'test_user', password:'123456', email:'test@hy-studio.cn', profile: name: 'Byrne Yan'
  beforeEach angular.mock.module 'shareBJ.users'

  describe "LoginCtrl", ->

    $controller = null
    $rootScope = null
    $location = null
    $scope = null
    $state = null

    beforeEach angular.mock.inject (_$rootScope_, _$controller_,_$state_, _$location_, $templateCache) ->
      $controller = _$controller_
      $rootScope =_$rootScope_
      $location = _$location_
      $state = _$state_
      $scope = $rootScope.$new()
      $templateCache.put 'login.ng.html',''

    describe '$scope.login', ->
      it 'should have a valid user logged in', ->
        loginCtrl = $controller 'LoginCtrl', $scope:$scope
        $state.go 'users_login'
        $rootScope.$digest()
        $scope.username = 'test_user'
        $scope.password = '123456'
        $scope.login()
        expect($state.current.name).toBe('users_login')
        expect($location.path()).toBe('/login')


#  it "should have a valid user logged in", ->
#    $meteor.logout()
#    .then ->
#      expect($rootScope.currentUser).toBeNull()
#      $meteor.loginWithPassword 'test_user', '123456'
#      .then ->
#        expect($rootScope.currentUser.username).toEqual('test_userX')
#      .then (error)->
#        expect(true).toEqual(false)
#    .then (error)->
#      expect(true).toEqual(false)
#
#  it "should not have an invalid user logged in", ->
#    $meteor.logout()
#    .then ->
#      expect($rootScope.currentUser).toBeNull()
#      $meteor.loginWithPassword 'test_user', '12345678'
#      .then ->
#        expect($rootScope.currentUser).toBeNull()
#      .then (error)->
#        expect(true).toEqual(true)
#    .then (error)->
#      expect(true).toEqual(false)


