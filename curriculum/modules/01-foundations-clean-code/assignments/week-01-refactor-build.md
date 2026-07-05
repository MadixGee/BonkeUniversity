# Module 01 · Week 1 — Assignment: The Refactor Build
*The applied artifact (Charter #2). Passing the Reviewer on this is the gate to Module 02 (Charter #5).*

## The brief
Below is a deliberately messy program that computes an invoice total for an order (with discounts, tax, and shipping). It works — the behavior is correct — but it is painful to read and change. **Your job is not to rewrite it from scratch. Your job is to refactor it: same behavior, cleaner structure, in small safe steps behind tests.**

## The messy starter (`orders.py`)
```python
def calc(o):
    t = 0
    for i in o["items"]:
        t = t + i["p"] * i["q"]
    # discount
    if t > 100:
        if o["c"] == "gold":
            t = t - t * 0.15
        else:
            t = t - t * 0.05
    else:
        if o["c"] == "gold":
            t = t - t * 0.10
    # tax
    t = t + t * 0.2
    # shipping
    if t < 50:
        t = t + 9.99
    else:
        t = t + 0
    return round(t, 2)

# ad-hoc "tests"
print(calc({"items":[{"p":10,"q":2},{"p":5,"q":1}], "c":"normal"}))
print(calc({"items":[{"p":80,"q":2}], "c":"gold"}))
```

## Your tasks (in order — this order is the lesson)
1. **Characterize the behavior first.** Before changing anything, write **unit tests** that capture what `calc` currently does for several orders (small/large totals, gold/normal customers, the shipping threshold). These become your safety net. *Do not "fix" behavior yet.*
2. **Refactor in small green steps**, committing after each:
   - Rename `calc`, `o`, `t`, `i`, `p`, `q`, `c` to intention-revealing names.
   - Replace magic numbers (`0.15`, `0.2`, `9.99`, `100`, `50`) with named constants.
   - Extract cohesive functions: `subtotal`, `discount`, `tax`, `shipping`. Each does one thing at one level of abstraction.
   - Remove the nested-conditional discount logic in favor of something a reader can follow.
3. **Keep tests green the whole way.** Run them after every step. If they go red, your last step changed behavior — revert and try smaller.
4. **Write one short trade-off note** (`DECISIONS.md`): pick one refactoring choice you made, name the alternative you rejected, and justify what you gave up (Charter #4). Example prompts: Did you collapse the discount branches into a table/lookup, or keep explicit `if`s? Why?

## Deliverable & how to submit
Push to `projects/module-01-project/`:
```
projects/module-01-project/
  orders.py            # your refactored code
  test_orders.py       # your unit tests (must pass)
  DECISIONS.md         # your trade-off note
```
Commit history matters — small, coherent commits with honest messages (that's graded).

## The gate (exit criterion — Charter #5)
The **Reviewer** runs `config/rubrics/code-review.md` in code mode. You **PASS** (and Module 02 unlocks) only when:
- All your unit tests pass, and they meaningfully cover discount/tax/shipping branches (not just the happy path).
- No rubric criterion is below 2, and the **Trade-offs** criterion is ≥ 3.
- Behavior is unchanged from the starter (your characterization tests still describe the same outputs).

## What "done" looks like
A stranger can open `orders.py`, understand the pricing rules in under a minute, change the gold-discount rate with confidence because a test will catch a mistake, and read your commit history like a short story. That's the whole game.

> Charter #6: use AI to *review* your refactor if you like — but you must be able to defend every name and every extraction as your own decision.
