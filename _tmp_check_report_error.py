# -*- coding: utf-8 -*-
import json
import urllib.request

BASE = "http://127.0.0.1:5001"

with urllib.request.urlopen(BASE + "/api/report/status", timeout=30) as r:
    st = json.loads(r.read().decode("utf-8", "ignore"))

print(json.dumps(st, ensure_ascii=False, indent=2))
