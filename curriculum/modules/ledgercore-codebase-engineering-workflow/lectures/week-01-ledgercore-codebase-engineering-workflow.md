# LedgerCore Codebase & Engineering Workflow

Estimated study time: 360 minutes

## Learning Objectives
- Navigate a professional-grade Go-based microservice codebase using standard directory structures.
- Execute the full local development lifecycle including linting, testing, and containerized execution.
- Apply Git-flow methodologies for feature branching and pull request documentation.
- Interpret automated test coverage reports to identify potential regressions in core logic.
- Configure local environment variables and secrets for secure local development.

## Prerequisites
- Basic proficiency in Go (Golang) syntax
- Fundamental understanding of Git (commit, push, pull, branch)
- Command-line familiarity (bash/zsh)
- Basic understanding of Docker containers

## Why This Matters
In production-grade financial systems, the ability to navigate a complex codebase quickly and safely is the difference between a 5-minute hotfix and a multi-hour outage. Inconsistent engineering workflows lead to 'code rot' and broken CI/CD pipelines, which directly increase the risk of introducing bugs into immutable transaction logs. Mastering a standardized workflow ensures that every change is verifiable, testable, and reversible.

## Practical Examples
1. Scenario: A developer needs to add a new transaction type. Decision: Instead of modifying the core logic in /internal/engine, they create a new strategy in /internal/domain/transactions to maintain the Open/Closed Principle. Outcome: The core engine remains untouched, reducing regression risk.
2. Scenario: A local database connection fails during testing. Decision: Use a.env file for local development while relying on environment variables in production. Outcome: Prevents accidental connection to production databases from a local machine.
3. Scenario: A bug is found in the interest calculation logic. Decision: Create a feature branch 'fix/interest-calc', write a failing unit test in /internal/domain/interest_test.go, and fix the code until the test passes. Outcome: Guaranteed regression testing for the fix.

## Architecture Discussion
The LedgerCore architecture follows a Hexagonal (Ports and Adapters) pattern to decouple business logic from external dependencies like databases or message brokers. By separating '/internal/domain' (the core logic) from '/internal/adapter' (the implementation details), we ensure that the core ledger rules are not dependent on whether we use PostgreSQL or a distributed ledger. However, this abstraction introduces a trade-off: increased boilerplate code and cognitive load for new developers. If the boundaries are drawn too granularly, the system becomes 'fragmented,' making it difficult to trace a single transaction flow through dozens of interfaces. Engineers must balance strict decoupling with the practical necessity of readable, traceable code paths.

## Coding Exercise
Task: Implement a 'Health Check' command. 1. Create a new sub-package in `/cmd/ledger-cli`. 2. Implement a function that checks if the local Docker container for PostgreSQL is reachable using a simple `db.Ping()`. 3. Write a unit test in the same directory using a mock database driver to ensure the health check logic handles 'connection refused' errors correctly. 4. Run `go test./cmd/ledger-cli/...` to verify.

## Project Assignment
Project: The 'First Commit' Workflow. 1. Clone the provided LedgerCore skeleton repository. 2. Create a feature branch named `feat/setup-env`. 3. Implement a custom CLI command `ledger config check` that validates the presence of required environment variables (DB_URL, API_KEY, LOG_LEVEL). 4. Add a Dockerfile to the root directory that installs the Go toolchain and builds the CLI. 5. Submit a Pull Request with a detailed description of the command and a screenshot of the successful execution of `docker build`.

## Reflection Questions
1. Why is it dangerous to store sensitive credentials directly in the source code, even for local development?
2. What are the risks of a 'onolithic' directory structure where all logic resides in a single package?
3. How does the use of 'interfaces' in the adapter layer facilitate unit testing for the domain layer?
4. If a developer bypasses the standard Git workflow and pushes directly to 'ain', what are the downstream impacts on the CI/CD pipeline?

## Source-backed Claims
1. The Twelve-Factor App methodology recommends storing configuration in the environment to maintain strict separation of config from code.
   Source: https://12factor.net/config
2. Go projects benefit from a standardized layout to improve maintainability and predictability across different teams.
   Source: https://github.com/golang-standards/project-layout
3. Effective Go emphasizes using interfaces to define behavior, allowing for modular and testable code.
   Source: https://go.dev/doc/effective_go