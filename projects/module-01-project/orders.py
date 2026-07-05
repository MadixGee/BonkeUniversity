def calc(o):
    invoiceTotal = 0
    for i in o["items"]:
        invoiceTotal = invoiceTotal + i["p"] * i["q"]
    # discount
    if invoiceTotal > 100:
        if o["c"] == "gold":
            invoiceTotal = invoiceTotal - invoiceTotal * 0.15
        else:
            invoiceTotal = invoiceTotal - invoiceTotal * 0.05
    else:
        if o["c"] == "gold":
            invoiceTotal = invoiceTotal - invoiceTotal * 0.10
    # tax
    t = invoiceTotal + invoiceTotal  * 0.2
    # shipping
    if invoiceTotal < 50:
        invoiceTotal = invoiceTotal + 9.99
    else:
        invoiceTotal = invoiceTotal + 0
    return round(t, 2)

# ad-hoc "tests"
print(calc({"items":[{"p":10,"q":2},{"p":5,"q":1}], "c":"normal"}))
print(calc({"items":[{"p":80,"q":2}], "c":"gold"}))
print(calc({"items": [{"p": 10, "q": 2}, {"p": 5, "q": 1}], "c": "gold"}))