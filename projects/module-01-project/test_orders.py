import unittest

from orders import calc


class TestCalculateSubtotals(unittest.TestCase):
    def test_calculate_gold_customer_discount_small_order(self):
        self.assertEqual(
            calc({"items": [{"p": 10, "q": 2}, {"p": 5, "q": 1}], "c": "gold"}),
            36.99,
        )


if __name__ == "__main__":
    unittest.main()