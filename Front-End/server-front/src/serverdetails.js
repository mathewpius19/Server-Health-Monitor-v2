import Axios from "axios"
import React, { Component } from "react"
import CircularProgress from "@material-ui/core/CircularProgress";
import { navigate } from "@reach/router";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import openConnection from "socket.io-client"

function subscribeToSocket(ipAddr, callback){
  const socket = openConnection(`http://${ipAddr}:4000/`);
  socket.emit("get-health", window.location.href)
  socket.on("send-health", (receievedData)=>callback(null, receievedData));
}

class ServerDetails extends Component{
    

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
      };
    componentDidMount(){
      this.setState({loading:false})
      subscribeToSocket(this.state.ipAddr, (err, receivedData)=>{
        // console.log(receivedData)
        this.setState({data:receivedData, socketRunning:true});

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
              if(socketRunning){
                alert("Health reporting is already running on remote server")
              }
              else{
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
            }

            
                return(
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
                Set up Server Health Monitoring
              </p>
            </CardContent>
          </Card>
                );
                
            // const rows=[]
            // function createData(col1,col2, col3, col4, col5)
            // {
            //     return{col1, col2, col3, col4, col5}
            // }
            // Epoch_Time.forEach((element, index)=>{
            //     const newRow = createData(
            //       parseFloat(Epoch_Time[index]),
            //       parseFloat(Disk_Free[index]),
            //     parseFloat(Memory_Free[index]),
            //     parseFloat(CPU_Usage_Percent[index]),
            //     parseFloat(CPU_Time[index])
            //     );
            //     rows.push(newRow);
                
            // })
            // return (
            //     <div className="health-data">
            //       <Card style={{ maxHeight: "29%" }}>
            //         <CardContent>
            //           <Typography variant="h5">{this.state.serverName}</Typography>
            //           <Typography>{this.state.user}</Typography>
            //           <p
            //             className="waves-effect btn remove-server"
            //             onClick={removeServer}
            //           >
            //             REMOVE SERVER
            //           </p>
            //         </CardContent>
            //       </Card>
            //       <TableContainer component={Paper}>
            //         <Table size="small" style={{minWidth:"650", background:"lightblue"}}>
            //           <TableHead>
            //             <TableRow>
            //               <TableCell>Epoch Time</TableCell>
            //               <TableCell align="right">Disk Free (bytes)</TableCell>
            //               <TableCell align="right">Memory Free (%)</TableCell>
            //               <TableCell align="right">CPU Usage (%)</TableCell>
            //               <TableCell align="right">CPU Time Elapsed</TableCell>
            //             </TableRow>
            //           </TableHead>
            //           <TableBody>
            //             {rows.map((row, index) => (
            //               <TableRow>
            //                 <TableCell component="th" scope="row">
            //                   {row.col1}
            //                 </TableCell>
            //                 <TableCell align="right">{row.col2}</TableCell>
            //                 <TableCell align="right">{row.col3}</TableCell>
            //                 <TableCell align="right">{row.col4}</TableCell>
            //                 <TableCell align="right">{row.col5}</TableCell>
            //               </TableRow>
            //             ))}
            //           </TableBody>
            //         </Table>
            //       </TableContainer>
            //     </div>
            //)
        }
    }
}
export default ServerDetails;