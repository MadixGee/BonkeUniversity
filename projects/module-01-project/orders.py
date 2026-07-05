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
print(calc({"items": [{"p": 10, "q": 2}, {"p": 5, "q": 1}], "c": "gold"}))