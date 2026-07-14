# Implement an LRU Cache for a Simple Data Service

In this assignment you will build a lightweight, in‑memory LRU (Least‑Recently‑Used) cache in Java and integrate it into a mock data access service that simulates database lookups. The goal is to demonstrate how caching reduces expensive data fetches and to observe the eviction policy in action.

## Deliverables
- A Java class `LRUCache<K,V>` that implements a fixed‑size cache with O(1) get/put operations and LRU eviction.
- A mock `DataService` class that uses `LRUCache` to cache results of simulated database queries (e.g., reading from a pre‑populated `Map`).
- A JUnit test suite that verifies cache hit/miss behavior, correct eviction order, and that the service reduces the number of simulated database accesses when the cache is populated.
- A README.md that explains the design, how to run the tests, and the observed cache behavior (including any simple performance notes).

## Acceptance Criteria
- The `LRUCache` must store up to a configurable capacity and evict the least‑recently‑used entry when capacity is exceeded.
- `DataService.get(id)` must first check the cache and only query the simulated database when the entry is missing, returning the cached value on subsequent calls.
- Unit tests must pass: (1) a cache hit returns the same instance without adding a new entry, (2) after inserting `capacity + 1` distinct keys, the first inserted key is no longer present, and (3) the mock database access counter increments only on cache misses.
- The README must clearly describe the cache algorithm, how eviction is determined, and provide a short example of running the service and observing cache hits/misses.
- All code compiles with Java 17+, follows standard naming conventions, and is free of compilation warnings.