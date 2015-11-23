Feature: Login With Phone
  As a user
  I want login with my mobile phone


  Scenario: Login With Phone Number and Password
    Given I have register with a verified phone
    When  I visit sign in page and then input my phone and password correctly
    Then  I logined
