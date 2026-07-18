# Codebase Orientation & Engineering Workflow

1. When working in a professional engineering environment, what is the primary purpose of using a 'feature branch' workflow instead of committing directly to the 'ain' branch?
   - To ensure that all code is automatically deployed to production immediately upon being written.
   - To allow multiple developers to work on isolated features without disrupting the stable codebase.
   - To reduce the total number of commits required in the project history.
   - To bypass the need for code reviews and automated testing.
   Answer: To allow multiple developers to work on isolated features without disrupting the stable codebase.

2. You are tasked with investigating a bug that was introduced in the latest deployment. Which tool or process is most effective for identifying exactly which commit caused the regression?
   - A linter to check for syntax errors.
   - A dependency manager to check for outdated libraries.
   - Git bisect to perform a binary search through the commit history.
   - A container orchestration tool to restart the service.
   Answer: Git bisect to perform a binary search through the commit history.

3. In a standard professional workflow, what is the correct sequence of actions for implementing a new feature?
   - Commit to main -> Push to remote -> Open Pull Request -> Merge.
   - Create feature branch -> Implement code -> Run local tests -> Open Pull Request -> Review & Merge.
   - Write documentation -> Push to main -> Notify team -> Delete branch.
   - Create feature branch -> Push to remote -> Merge to main -> Run tests.
   Answer: Create feature branch -> Implement code -> Run local tests -> Open Pull Request -> Review & Merge.

4. What is the main benefit of using a '.gitignore' file in a software project?
   - It prevents the project from being uploaded to a remote repository.
   - It automatically fixes formatting issues in the source code.
   - It prevents sensitive information (like API keys) and build artifacts from being tracked by version control.
   - It optimizes the performance of the Git command-line interface.
   Answer: It prevents sensitive information (like API keys) and build artifacts from being tracked by version control.