import unittest

from orders import calc


class TestCalculateSubtotals(unittest.TestCase):
    def test_calculate_gold_customer_discount_small_order(self):
        self.assertEqual(
            calc({"items": [{"p": 10, "q": 2}, {"p": 5, "q": 1}], "c": "gold"}),
            36.99,
        )

    def test_calculate_normal_customer_discount_small_order(self):
        self.assertEqual(
            calc({"items": [{"p": 7, "q": 2}, {"p": 0.5, "q": 1}], "c": "normal"}),
            27.39,
        )

    def test_calculate_gold_customer_discount_large_order(self):
        self.assertEqual(
            calc({"items": [{"p": 100, "q": 2}, {"p": 50, "q": 1}], "c": "gold"}),
            255.0,
        )

    def test_calculate_normal_customer_discount_large_order(self):
        self.assertEqual(
            calc({"items": [{"p": 700, "q": 2}], "c": "normal"}),
            1596.0,
        )




if __name__ == "__main__":
    unittest.main()