import sys
import os
password=sys.argv[1]
username=sys.argv[2]
servername=sys.argv[3]
os.system(f"echo {password}|sudo -S apt install python3-pip")
os.system("pip3 install psutil")
os.system("pip3 install requests")
os.system(f"python3 report.py {servername} {username} ")




