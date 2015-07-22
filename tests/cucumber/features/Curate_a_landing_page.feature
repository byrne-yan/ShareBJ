Feature: Curate a Landing Page

  As an marketer
  I want to curate a landing page
  So that I can entice to join our baby journal community

  @dev
  Scenario: A unique differentiating title
    Given I have created a landing page with the heading "Share Baby Journal Community"
    And
    When a user navigates to the landing page
    Then they see the heading "Share Baby Journal Community"


