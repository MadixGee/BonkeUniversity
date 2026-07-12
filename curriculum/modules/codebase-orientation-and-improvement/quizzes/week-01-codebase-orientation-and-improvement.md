# Codebase Orientation and Improvement

1. When first entering a large, unfamiliar codebase, which of the following actions is most effective for understanding the high-level architecture and data flow?
   - Reading every line of code in the utility folder
   - Tracing a single request from the entry point (e.g., an API route) through the service layer to the data layer
   - Running the full test suite and fixing every warning
   - Rewriting the core logic to match your preferred coding style
   Answer: Tracing a single request from the entry point (e.g., an API route) through the service layer to the data layer

2. You identify a complex function that lacks documentation and has high cyclomatic complexity. What is the best first step for improving this code without breaking existing functionality?
   - Refactor the entire module into microservices immediately
   - Delete the function and rewrite it from scratch
   - Write a characterization test to capture current behavior, then refactor incrementally
   - Add comments explaining what you *think* the code does
   Answer: Write a characterization test to capture current behavior, then refactor incrementally

3. Which of the following is a primary benefit of using a 'Dependency Injection' pattern when orienting yourself to a new codebase?
   - It makes the code run faster by reducing CPU cycles
   - It allows you to easily swap real implementations with mocks during testing
   - It automatically documents the business logic for new developers
   - It prevents any possibility of runtime errors
   Answer: It allows you to easily swap real implementations with mocks during testing

4. While exploring a repository, you notice the project uses a 'Monolith' structure. What is a key indicator that the codebase might be suffering from 'Tight Coupling'?
   - The project uses a single database for all modules
   - Changes in one module require unexpected changes in a seemingly unrelated module
   - The codebase is too large to fit in a single IDE window
   - The project uses a standard directory structure like /src and /tests
   Answer: Changes in one module require unexpected changes in a seemingly unrelated module