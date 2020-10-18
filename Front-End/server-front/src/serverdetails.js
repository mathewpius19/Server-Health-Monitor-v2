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


class ServerDetails extends Component{
    state = {
        password:this.props.password,
        user: this.props.user,
        username: this.props.username,
        serverName: this.props.serverName,
        loading:true
    }
    componentDidMount(){
        Axios.post("/health/display",
        {
            username:this.state.username,
            user:this.state.user,
            password:this.state.password,
            serverName:this.state.serverName,
            details:"all"
        })
        .then(({data})=>{
            this.setState({
                health:data,
                loading:false
            })
        })
    }
    render(){
        if(this.state.loading){
            return(
                <CircularProgress/>
            )
        }
        else{
            const {serverName, username, password} = this.state;
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
            const healthData=this.state.health;
            console.log(healthData)
            const {
                Epoch_Time,
                Disk_Free,
                Bytes_Sent,
                Bytes_Received,
                Packets_Sent,
                Packets_Received,
                Memory_Free,
                CPU_Usage_Percent,
                CPU_Time
            } = healthData
            if(Epoch_Time===undefined){
                return(
                    <Card style={{ maxHeight: "30%", minHeight: "50%" }}>
            <CardContent>
              <Typography variant="h5">{this.state.serverName}</Typography>
              <Typography>{this.state.user}</Typography>
              <Typography>
                Health reporting service is offline on remote server
              </Typography>
              <p
                className="waves-effect btn remove-server"
                onClick={removeServer}
              >
                REMOVE SERVER
              </p>
            </CardContent>
          </Card>
                );
            }
            const rows=[]
            function createData(col1,col2, col3, col4, col5, col6, col7, col8, col9)
            {
                return{col1, col2, col3, col4, col5, col6, col7, col8, col9}
            }
            Epoch_Time.forEach((element, index)=>{
                const newRow = createData(
                  parseFloat(Epoch_Time[index]),
                  parseFloat(Disk_Free[index]),
                parseFloat(Bytes_Sent[index]),
                parseFloat(Bytes_Received[index]),
                parseFloat(Packets_Sent[index]),
                parseFloat(Packets_Received[index]),
                parseFloat(Memory_Free[index]),
                parseFloat(CPU_Usage_Percent[index]),
                parseFloat(CPU_Time[index])
                );
                rows.push(newRow);
                
            })
            return (
                <div className="health-data">
                  <Card style={{ maxHeight: "29%" }}>
                    <CardContent>
                      <Typography variant="h5">{this.state.serverName}</Typography>
                      <Typography>{this.state.user}</Typography>
                      <p
                        className="waves-effect btn remove-server"
                        onClick={removeServer}
                      >
                        REMOVE SERVER
                      </p>
                    </CardContent>
                  </Card>
                  <TableContainer component={Paper}>
                    <Table size="small" style={{minWidth:"650", background:"lightblue"}}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Epoch Time</TableCell>
                          <TableCell align="right">Disk Free (bytes)</TableCell>
                          <TableCell align="right">Bytes Sent</TableCell>
                          <TableCell align="right">Bytes Recieved</TableCell>
                          <TableCell align="right">Packets Sent</TableCell>
                          <TableCell align="right">Packets Received</TableCell>
                          <TableCell align="right">Memory Free (%)</TableCell>
                          <TableCell align="right">CPU Usage (%)</TableCell>
                          <TableCell align="right">CPU Time Elapsed</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow>
                            <TableCell component="th" scope="row">
                              {row.col1}
                            </TableCell>
                            <TableCell align="right">{row.col1}</TableCell>
                            <TableCell align="right">{row.col2}</TableCell>
                            <TableCell align="right">{row.col3}</TableCell>
                            <TableCell align="right">{row.col4}</TableCell>
                            <TableCell align="right">{row.col5}</TableCell>
                            <TableCell align="right">{row.col6}</TableCell>
                            <TableCell align="right">{row.col7}</TableCell>
                            <TableCell align="right">{row.col8}</TableCell>
                            <TableCell align="right">{row.col9}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
            )
        }
    }
}
export default ServerDetails;