import sqlite3
from flask import Flask,render_template
from flask import request
import json
import time

PORT=4400

app=Flask(__name__)
@app.route("/report",methods=['POST'])
def report():
    time_epoch=time.time()
    incoming_report = request.get_json()
    username=incoming_report["USER_NAME"]
    server_name=incoming_report["SERVER_NAME"]
    disk_free=incoming_report["free_Percnt"]
    bytes_sent=incoming_report["bytes_sent"]
    bytes_received=incoming_report["bytes_received"]
    packets_sent=incoming_report["packets_sent"]
    packets_received=incoming_report["packets_received"]
    memory_free=incoming_report["memory_Free"]
    cpu_percent=incoming_report["cpupercent"]
    cpu_total=incoming_report["cpu_total"]
    conn=sqlite3.connect("Health.db")
    response_message={"message":"Generating Health Report"}
    
    try:
        conn.execute(f"create table if not exists {username}_{server_name} (HEALTH_ID integer primary key AUTOINCREMENT,Time_Epoch integer,Disk_Free varchar(80),Bytes_Sent varchar(80),Bytes_Received varchar(80),Packets_Sent varchar(80),Packets_Received varchar(80),Memory_Free varchar(80),Cpu_Usage_Percent varchar(80),Cpu_Time varchar(80));")
        conn.execute(f'insert into {username}_{server_name} (Time_Epoch,Disk_Free,Bytes_Sent,Bytes_Received,Packets_Sent,Packets_Received,Memory_Free,Cpu_Usage_Percent,Cpu_Time) values {time_epoch,disk_free,bytes_sent,bytes_received,packets_sent,packets_received,memory_free,cpu_percent,cpu_total}')
        return response_message
    except:
        return "Generation Failed"

    finally:
        try:
            conn.commit()
        except:
            "DB commit failed"  


@app.route("/Display",methods=['POST'])
def display():
    object=request.json
    username=object["Username"]
    servername=object["Servername"]
    OldDetails=object["Details"]
    conn=sqlite3.connect("Health.db")
    health_dict={'message':'Generating Health Report','Health_id':[],'Epoch_Time':[],'Disk_Free':[],'Bytes_Sent':[],'Bytes_Received':[],'Packets_Sent':[],'Packets_Received':[],'Memory_Free':[],'CPU_Usage_Percent':[],'CPU_Time':[]} 
    try:
        details=OldDetails.replace(" ","").lower()
        health_dict['message']="Generating Health Report"
        cur=conn.cursor()
        if details=='all':
            cur.execute(f" select * from {username}_{servername} order by HEALTH_ID")
        elif (details=='last10'):
            cur.execute(f" select * from {username}_{servername} order by HEALTH_ID desc limit 10")
        elif(details=='first10'):
            cur.execute(f" select * from {username}_{servername} order by HEALTH_ID asc limit 10")
        for row in cur:
            health_dict['Health_id'].append(row[0])
            health_dict['Epoch_Time'].append(row[1])
            health_dict['Disk_Free'].append(row[2])
            health_dict['Bytes_Sent'].append(row[3])
            health_dict['Bytes_Received'].append(row[4])
            health_dict['Packets_Sent'].append(row[5])
            health_dict['Packets_Received'].append(row[6])
            health_dict['Memory_Free'].append(row[7])
            health_dict['CPU_Usage_Percent'].append(row[8])
            health_dict['CPU_Time'].append(row[9])  
    except Exception as e:
        return {"Error":str(e)}       
    finally:
        try:
            conn.commit()
        except:
            return "DB commit failed"
    health=json.dumps(health_dict)
    return health


if __name__ ==("__main__"):
    print("Emitter flask server is running...")
    print(f"listening at port {PORT}...")
    app.run(host='0.0.0.0',debug=True,port=PORT)
    
