Feature: Curate home page
  As a user
  I want visit my home page
  So that I can review, record, comment and share my babies' behaviours


  Scenario: Review my baby's history behaviours
    Given I have signed up
    And   My baby's profile created
    When  I sign in
    Then  my baby's basic information(name,age) and her/his recorded history behaviours showed