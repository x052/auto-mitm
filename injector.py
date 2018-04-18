# Usage: mitmdump -s "js_injector.py"
# (this script works best with --anticache)

payload = open("payload.js", "r") .read() 
print ("Loaded payload from \"payload.js\"")

from bs4 import BeautifulSoup
from mitmproxy import ctx, http
import argparse

class Injector:
    def __init__(self):
        pass

    def response(self, flow: http.HTTPFlow) -> None:
        print (flow.response.content)
        html = BeautifulSoup(flow.response.content, "html.parser")
        print(flow.response.headers["content-type"])
        if flow.response.headers["content-type"] == 'text/html':
            print(flow.response.headers["content-type"])
            script = html.new_tag(
                "script",
                type='application/javascript')
            script.text = payload
            html.body.insert(0, script)
            flow.response.content = str(html).encode("utf8")
            print ("Script injected.")

def start():
    return Injector()