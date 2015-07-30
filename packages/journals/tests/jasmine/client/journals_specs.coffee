describe "sbj:journals", ->
  it 'should export an angular module "shareBJ.journals"', ->
    expect(angular.module('shareBJ.journals').toBeDefined());
