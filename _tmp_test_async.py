# -*- coding: utf-8 -*-
import glob
import json
import os
import time
import urllib.request

BASE = "http://127.0.0.1:5001"


def get_json(path: str):
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        return json.loads(r.read().decode("utf-8", "ignore"))


def post_json(path: str):
    req = urllib.request.Request(BASE + path, data=b"", method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8", "ignore"))


def get_text(path: str):
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")


print("A_before_status", get_json("/api/report/status"))

print("B_trigger_report", post_json("/api/report/trigger"))
for i in range(20):
    st = get_json("/api/report/status")
    print("C_poll_report", i, st.get("status"), st.get("report_key"), st.get("current_key"))
    if st.get("status") in ("ready", "error"):
        break
    time.sleep(2)

print("D_trigger_blockmeta", post_json("/api/blockmeta/preload"))
for i in range(20):
    bs = get_json("/api/blockmeta/status")
    print("E_poll_blockmeta", i, bs.get("status"), (bs.get("error") or "")[:100], bs.get("last_result"))
    if bs.get("status") in ("ready", "error"):
        break
    time.sleep(1)

cache_files = sorted(glob.glob("cache/block_meta_cache_*.json"))
print("F_cache_files", len(cache_files), cache_files[-1] if cache_files else "")
if cache_files:
    print("F_cache_size", os.path.getsize(cache_files[-1]))

html = get_text("/")
print("G_contains_0901", "09:01" in html)
print("G_contains_rps_times", all(t in html for t in ["09:25", "10:25", "11:25", "13:30", "14:30", "15:30"]))
print("G_contains_enter", "ev.key === 'Enter'" in html)
print("G_contains_trigger_api", "/api/report/trigger" in html)
print("G_contains_blockmeta_api", "/api/blockmeta/preload" in html)
