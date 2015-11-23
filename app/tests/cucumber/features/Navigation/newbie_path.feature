Feature: Navigation across various pages
  As a  user
  I want to visit various pages conveniently

  @dev
  Scenario: Navigate from login page to first journal creation page
    Given The app started and login page showed
    When  I click register link
    And I input phone  number, get verification code and then register
    Then Babies list page shows with no back button
