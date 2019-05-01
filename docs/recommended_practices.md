# Recommended Practices

This document serves as reference for current practices and patterns that we want to standardize across the code that supports Amundsen's frontend application. This document is not meant to provide an exhaustive checklist for completing specific tasks, rather it provides high-level guidelines targeted towards new contributors or any contributor who does not yet have domain knowledge for a particular framework or core library.

We aim to maintain a reasonably consistent code base through these practices and welcome PRs to update and improve these recommendations.

## React Application
### Unit Testing
We use [Jest](https://jestjs.io/) as our test framework and leverage utility methods from [Enzyme](https://airbnb.io/enzyme/) to test React components.

#### Recommendations
1. Leverage TypeScript to prevent bugs in unit tests -- ensure that components are tested with data that matches the interfaces defined in the source code. Adding and updating test [fixtures](https://github.com/lyft/amundsenfrontendlibrary/tree/master/amundsen_application/static/js/fixtures) helps provide re-useable pieces of typed test data for our code.
2. Enzyme provides 3 different utilities for rendering React components for testing. We recommend using `shallow` rendering to start off. If a component has a use case where it ends up needing full DOM rendering, those cases will become apparent. See Enzyme's [api documentation](https://airbnb.io/enzyme/docs/api/) for each option to read more about which cases each option is ideal for.
3. Create a re-useable `setup()` method that will take whatever parameters maybe be necessary to test conditional logic. Look for opportunities to organize tests in such a way that one `setup()` can be used to test assertions that occur under the same conditions. For example, a test block for a method that has no conditional logic should only have one `setup()`. However, it is not recommended to share a `setup()` result across tests for different methods or else we risk propagating side effects from one test block to another.
4. Leverage `beforeAll()`/`beforeEach()` for test setup when applicable. Leverage `afterAll()`/`afterEach` for teardown to remove any side effects of the test block. For example, if a mock implementation of a method was created in `beforeAll()` the original implementation should be restored in `afterAll()`. See Jest's [setup-teardown documentation](https://jestjs.io/docs/en/setup-teardown) for further understanding.
5. Use descriptive titles for all tests, we should be able to know what a test is checking for and what case applies from the titles in order to help debug failures.
6. Consider refactoring components or other files if they become burdensome to test. Potential options include (but are not limited to):
   * Creating subcomponents for large components, or helper methods for large functions.
   * Export constants from a separate file for hardcoded values and import them into the relevant files and test files. This is especially helpful for strings.
7. Code coverage is important to track but it only informs us of what code was actually run and executed during the test. The onus is on the developer to make sure that right assertions are run and that logic is adequately tested.
