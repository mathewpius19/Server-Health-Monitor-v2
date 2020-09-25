import sqlite3
from flask import Flask,render_template
from flask import request
import json
import time

app=Flask(__name__)



@app.route("/Registration",methods=['POST'])
def Regist_post():
    object=request.json
    username=object["Username"]
    password=object["Password"]
    security=object["Security"]
    conn=sqlite3.connect("Health.db")
    conn.execute("create table if not exists 'user'(UID integer primary key AUTOINCREMENT,username varchar(20),password varchar(20),security varchar(20));")
    response_message={"message":"Registration Successful"}
    try:
        conn.execute("insert into user(username,password,security) values(?,?,?)",(username,password,security))

    except:    
        response_message['message']="Registration Failed"

    finally:
        
        try:
            conn.commit()
        
        except:
            return "DB commit failed"
    response_message=json.dumps(response_message)
    return response_message



@app.route("/login",methods=['POST']) 
def login_post():
    object=request.json
    username=object["Username"]
    password=object["Password"]
    conn=sqlite3.connect("Health.db")
    conn.execute("create table if not exists 'user'(UID integer primary key AUTOINCREMENT,username varchar(20),password varchar(20),security varchar(20));")
    cur=conn.cursor()
    cur.execute("select exists(select username from user where username=(?))",(username,))
    response_message={"message":"Login Successful"}
    try:
    
        conn.execute(f"create table if not exists {username}_servers (IP_ID integer primary key AUTOINCREMENT,IP_Address varchar(20),Server_Name varchar(80));")
        response_message['message']="Login Successful"
    except:
        response_message["message"]="Login Failed"

    finally:
        try:
            conn.commit()
        except:
            return "DB commit failed"
        response_message=json.dumps(response_message)
        return response_message
            



@app.route("/Add_Server",methods=['POST'])
def add_server_post():
    object=request.json
    ip_address=object["IPAddress"]
    server_name=object["Servername"]
    username=object["Username"]
    conn=sqlite3.connect("Health.db")
    response_message={"message":"Server Registration Successful"}
    try:
        conn.execute(f'insert into {username}_servers (IP_Address,Server_Name) values {ip_address,server_name}')
        conn.execute(f"create table if not exists {username}_{server_name} (HEALTH_ID integer primary key AUTOINCREMENT,Time_Epoch integer,Disk_Free varchar(80),Bytes_Sent varchar(80),Bytes_Received varchar(80),Packets_Sent varchar(80),Packets_Received varchar(80),Memory_Free varchar(80),Cpu_Usage_Percent varchar(80),Cpu_Time varchar(80));")
        response_message['message']="Server Registration Successful"
    except:
        response_message["message"]="Server Registration Failed"
    finally:
        try:
            conn.commit()
        except:
            return "DB commit failed"
    response_message=json.dumps(response_message)
    return response_message
        
@app.route("/Remove_Server",methods=['POST'])
def remove_server():
    object=request.json
    username=object["Username"]
    servername=object["Servername"]
    response_message={"message":"Server Registration Successful"}
    conn=sqlite3.connect("Health.db")
    try:
        conn.execute(f'drop table {username}_{servername}')
        conn.execute(f'delete from {username}_servers where server_name=(?)',(servername,))
        response_message['message']="Server Deletion Successful"
    except:
        response_message["message"]="Server Deletion Failed"
    
    finally:
        try:
            conn.commit()
        except:
            return "DB commit Failed"
    responseMessage=json.dumps(response_message)
    return responseMessage

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
    details=object["Details"]
    conn=sqlite3.connect("Health.db")
    health_dict={'message':'Generating Health Report','Health_id':[],'Epoch_Time':[],'Disk_Free':[],'Bytes_Sent':[],'Bytes_Received':[],'Packets_Sent':[],'Packets_Received':[],'Memory_Free':[],'CPU_Usage_Percent':[],'CPU_Time':[]} 
    try:
    
        health_dict['message']="Generating Health Report"
        cur=conn.cursor()
        if details=='all':
            cur.execute(f" select * from {username}_{servername} order by HEALTH_ID")
        elif (details=='last 10'):
            cur.execute(f" select * from {username}_{servername} order by HEALTH_ID desc limit 10")
        else:
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
    except:
        return "Health Report cannot be generated"      
    finally:
        try:
            conn.commit()
        except:
            return "DB commit failed"
    health=json.dumps(health_dict)
    return health

@app.route("/security",methods=['POST'])
def security():
    object=request.json
    username=object["Username"]
    security=object["Security"]
    conn=sqlite3.connect("Health.db")
    response_message={'message':"Answer is correct"}
    try:
        cur=conn.cursor()
        cur.execute("select password from user where username=(?)",(username,))
        for row in cur:
            rowlist=list(row)
            response_message['password']=rowlist[0]
    except:
        return "Invalid Input"
    finally:
        try:
            conn.commit()
        except:
            return "DB commit failed"
    response=json.dumps(response_message)
    return response

if __name__ ==("__main__"):
    print("Emitter flask server is running...")
    print("listening at port 80...")
    app.run(debug=True,port=80)
