# Optimizing Transaction Logs with Linear Data Structures

In this assignment, you will implement a simplified transaction processing engine using arrays and linked lists. You will analyze the time and space complexity of different insertion and lookup operations to understand how data structure choice impacts system performance.

## Deliverables
- A Python script implementing a TransactionLog class using both an Array-based approach and a Linked List-based approach.
- A performance benchmarking script that measures execution time for 10,000 operations.
- A brief report (Markdown file) documenting the Big O complexity of each operation implemented.

## Acceptance Criteria
- The Array-based implementation must demonstrate O(1) access by index but O(n) for insertions at the beginning of the list.
- The Linked List implementation must demonstrate O(1) insertion at the head of the list.
- The benchmarking script must output a comparison table showing the time difference between the two structures for 'prepend' operations.
- The code must include type hints and pass basic unit tests for transaction integrity (no duplicate IDs).