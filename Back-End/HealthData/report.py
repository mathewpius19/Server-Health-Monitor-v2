import psutil
import requests
import time
import sys

PORT = 4400

flask_URL = f'http://localhost:{PORT}/report'
node_URL = "http://localhost:5555/health/gethealthdata"

try:
    SERVER_NAME=sys.argv[1]
    USER_NAME=sys.argv[2]
    print(SERVER_NAME,USER_NAME)
except:
    print("Invalid Entry")
    sys.exit()
       

def get_health(): 
    
    print('generating health report')

    cpu_percent = psutil.cpu_percent(interval=2.0)
    ctime = psutil.cpu_times()
    disk_usage = psutil.disk_usage("/")
    net_io_counters = psutil.net_io_counters()
    virtual_memory = psutil.virtual_memory()    

    # The keys in this dict should match the db cols
    report = dict (
        USER_NAME=USER_NAME,
        SERVER_NAME=SERVER_NAME,
        epoch_time=time.time(),
        cpupercent = cpu_percent,
        cpu_total = ctime.user + ctime.system,
        free_Percnt=(disk_usage.percent),
        memory_Free = virtual_memory.free,
        )

    return report
if __name__=='__main__':
    print("Reporting program is running and communicating with app.py at {PORT}...")

    while True:
        report = get_health()
        print("Done generating report. Sending report to flask emitting server.")
        r1 = requests.post(flask_URL, json=report)
        print("Sending data to node....")
        r2 = requests.post(node_URL, json=report)
        time.sleep(10)
