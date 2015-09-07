Feature: Create Account with Phone
  As a user
  I want enrollment with my mobile phone


  Scenario: Create Account with Phone
    Given No enrollment with my phone
    When  I visit enrollment page and then input my phone
    Then  I is logined
