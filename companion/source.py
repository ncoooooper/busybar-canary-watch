"""Probe several services and count successful observations since launch."""
import json,time,os,base64
from collections import deque
from urllib.request import Request,urlopen
from urllib.error import HTTPError,URLError
from serve import page
INTERVAL=30

def probe(service):
    headers={"User-Agent":"Canary-Watch/1.0"}
    if service.get("basic_env"):
        if not os.environ.get(service["basic_env"]):return "UNKNOWN",0
        headers["Authorization"]="Basic "+base64.b64encode(os.environ[service["basic_env"]].encode()).decode()
    start=time.monotonic()
    try:
        with urlopen(Request(service["url"],headers=headers),timeout=5) as r:
            if service.get("type")=="statuspage":
                flag=json.load(r)["status"]["indicator"]
                state={"none":"UP","minor":"DEGRADED","major":"DOWN","critical":"DOWN","maintenance":"MAINT"}.get(flag,"UNKNOWN")
            elif service.get("type")=="jenkins":
                payload=json.load(r)
                state="UP" if "mode" in payload or "_class" in payload else "UNKNOWN"
            else: state="UP"
    except HTTPError as exc: state="UNKNOWN" if exc.code in [401,403,429] else "DOWN"
    except (ValueError,KeyError):state="UNKNOWN"
    except (OSError,URLError):state="DOWN"
    return state,round((time.monotonic()-start)*1000)

def snapshot(o,m):
    services=o["services"]
    if not 1<=len(services)<=12:raise ValueError("Choose 1 to 12 services")
    pages=[];states=[]
    for s in services:
        state,ms=probe(s);states.append(state)
        history=m.setdefault(s["url"],deque(maxlen=120))
        if state!="UNKNOWN":history.append(state=="UP")
        rate=f"{100*sum(history)/len(history):.1f}%" if history else "--"
        pages.append(page(s["name"],state,rate+" healthy checks",f"{len(history)} observations",f"Last probe {ms} ms"))
    return dict(state="Last 120 known probes",key="/".join(states),pages=pages)
