import Axios from "axios"
import React, { Component } from "react"
import CircularProgress from "@material-ui/core/CircularProgress";
import { navigate } from "@reach/router";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import openConnection from "socket.io-client"
import Chart from "./linechart";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';


function subscribeToSocket(ipAddr, callback){
  const socket = openConnection(`http://${ipAddr}:4000/`);
  socket.emit("get-health", window.location.href)
  socket.on("send-health", (receievedData)=>callback(null, receievedData));
}

class ServerDetails extends Component{
    
    constructor(props){
      super(props)
      this.dataVisualise = this.dataVisualise.bind(this)
    }
    state = {
        password:this.props.password,
        user: this.props.user,
        username: this.props.username,
        serverName: this.props.serverName,
        ipAddr:this.props.ipAddr,
        loading:true,
        socketRunning:false,
        data:{
          uptime:"none",
          operatingSystem:"none",
          memoryUsedPercent:"none",
          cpuUsage:"none"
        },
        healthData:"",
      }      
    componentDidMount(){
      this.setState({loading:false})
      subscribeToSocket(this.state.ipAddr, (err, receivedData)=>{
        // console.log(receivedData)
        this.setState({data:receivedData, socketRunning:true});

      })
    }
    dataVisualise(){
      const details = prompt("Enter the number of rows of data you want from database (all, first 10 or last 10");
      const data = {
        username:this.state.username,
        password:this.state.password,
        serverName: this.state.serverName,
        details:details,
      }
      
      Axios.post("/health/display", data)
      .then(({data})=>{
        if(data==="Invalid Details Entered"){
          alert("Invalid Details Entered")
        }
        else{
        this.setState({showChart:true, healthData:data})
        }
      })
    }

    

    render(){
        if(this.state.loading){
            return(
                <CircularProgress/>
            )
        }
        else{
            const {serverName, username, password, socketRunning} = this.state;
            function removeServer(){
                const passw=prompt(
                    "Please enter the password to delete the server"
                )
                if(passw===password){
                    Axios.post("/users/removeserver",{
                        username:username,
                        serverName:serverName
                    })
                    .then(({data})=>{
                        if(data === `Server with name ${serverName} has been removed from list of servers`){
                        alert(data);
                        navigate("/")
                        }
                        else{
                            alert("Failed to delete server. [Internal Issue]");
                        }
                    })
                }
                else{
                    alert("Did not delete server");
                }
            }
            function startHealthReportingService(){
              if(!socketRunning){
                alert("Please wait while your server stats are collected..")
                const data = {
                  username:username,
                  serverName:serverName,
                  password:password
                };
                Axios.post("/health/setupserver", data)
                .then((response)=>{
                  console.log(response);
                  alert("Health service running");
                })

              }
              else{
                alert("Health service is already running!")
                }
              }
              

            
                return(
                  <div>
                    <Card style={{ maxHeight: "30%", minHeight: "50%" }}>
            <CardContent>
              <Typography variant="h5">{this.state.serverName}</Typography>
              <Typography variant="h5">{this.state.data.operatingSystem}</Typography>
              <Typography>User: {this.state.user}</Typography>
              <Typography>Uptime: {this.state.data.uptime}</Typography>
              <Typography>CPU Usage: {this.state.data.cpuUsage}</Typography>
              <Typography>Memory Usage: {this.state.data.memoryUsedPercent}</Typography>
              <Typography>
                {this.state.socketRunning?"Server Health Monitoring is On":"Server Health Monitoring for remote server is offline"}
              </Typography>
              <p
                className="waves-effect btn remove-server"
                onClick={removeServer}
              >
                REMOVE SERVER
              </p>
              <p
              className="waves-effect btn"
              onClick={startHealthReportingService}
              >
                Set up Server
              </p>

              <p
              className="waves-effect btn"
              onClick={this.dataVisualise}
              >
                Data Visualise
              </p>
            </CardContent>
            
            
          </Card>
          <Chart data={this.state.healthData}/>
          {/* <List>
                  <ListItem button>
                    <ListItemIcon>
                    <LocalHospitalIcon/>
                    </ListItemIcon>
                    <ListItemText
                    primary="CPU Usage Percent"/>
                    <Chart data={this.state.healthData, } />
                  </ListItem>
          </List> */}

         
          </div >
          
          
          
          

                );
            
        }
    }
}
export default ServerDetails;