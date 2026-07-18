# LedgerCore Codebase & Engineering Workflow Assessment

1. Which version control practice best aligns with maintaining a stable main branch in a project using LedgerCore?
   - Commit directly to main after every small change
   - Use feature branches for new features and merge via pull requests
   - Never commit to main, only use a single development branch
   - Avoid version control entirely for speed
   Answer: Use feature branches for new features and merge via pull requests

2. What is the primary purpose of a code review process in the LedgerCore engineering workflow?
   - To ensure code is formatted consistently with team standards
   - To catch bugs and improve code quality before merging
   - To assign blame for errors in production
   - To speed up deployment by skipping reviews
   Answer: To catch bugs and improve code quality before merging

3. In a CI/CD pipeline for LedgerCore, which step is critical for ensuring reliable deployments?
   - Manually testing code on a developer's machine before deployment
   - Automating unit and integration tests before deployment
   - Deploying only during business hours
   - Skipping tests to reduce pipeline time
   Answer: Automating unit and integration tests before deployment

4. Which approach is recommended for managing dependencies in a LedgerCore project to avoid version conflicts?
   - Update dependencies manually without tracking changes
   - Use a lock file to pin exact versions
   - Share dependencies across all projects without isolation
   - Ignore dependency versions for simplicity
   Answer: Use a lock file to pin exact versions

5. What type of testing is most effective for validating the integration of components in a LedgerCore system?
   - Only unit tests for individual functions
   - Only end-to-end tests simulating user workflows
   - Only performance tests under load
   - A combination of unit and integration tests
   Answer: A combination of unit and integration tests