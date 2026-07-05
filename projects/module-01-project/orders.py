def calc(orders):
    sub_total = 0
    for i in orders["items"]:
        sub_total = sub_total + i["p"] * i["q"]

    # discount
    discounted_total = sub_total - calc_discount(orders["c"], sub_total)

    # tax
    totalAfterTax = calc_tax(discounted_total)

    # shipping
    sub_total = calc_shipping(totalAfterTax)

    return round(sub_total, 2)


def calc_tax(sub_total):
    sub_total = sub_total + sub_total * 0.2
    return round(sub_total, 2)


def calc_shipping(sub_total):
       if sub_total < 50:
        sub_total = sub_total + 9.99

       return sub_total

def calc_discount(customer_type, sub_total):
    match customer_type:
        case "gold":
            if sub_total > 100:
                return sub_total * 0.15
            else:
                return sub_total * 0.10
        case "normal":
            if sub_total > 100:
                return sub_total * 0.05
            else:
                return 0
