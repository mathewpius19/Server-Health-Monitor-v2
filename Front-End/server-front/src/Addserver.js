import Axios from "axios";
import React, { useContext, useState } from "react"
import SignInContext from "./signInContext"
import {navigate} from "@reach/router";
import { CardContent, Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";


const Addserver=()=>{
    const [signInState, setSignInState] = useContext(SignInContext);
    const [serverName, setServerName] = useState("");
    const [sshKey, setSshKey] = useState(false);
    const [ipAddr, setIpAddr] = useState("");
    const [serverUser, setServerUser] = useState("");
    const [serverPassword, setServerPassword] = useState("");
    const verifyAndSendDetails= ()=>{
        const ssh=false;
        if((serverUser === "") | (serverPassword === "") |(ipAddr==="") | (serverName==="")) {
            alert("Form data not complete");
        }
        const serverUserChar0 = parseInt(serverUser.charAt(0));
        const serverNameChar0 = parseInt(serverName.charAt(0));
        var regex = /^[A-Za-z0-9 ]+$/ //Regular expression containing special characters
        var isValidServerPass = regex.test(serverPassword);
        var isValidServerUser = regex.test(serverUser);
        var isValidServerName = regex.test(serverName);
          if (!isValidServerPass) {
            alert("Password should not contain special characters.");
            return 0
          }
          else if(serverPassword.indexOf(' ') >= 0){
            alert("Password should not contain spaces");
            return 0
          }
          else if(Number.isInteger(serverUserChar0)){
            alert("Username should not start with a number");
            return 0
          }
          else if(serverUser.indexOf(' ') >= 0){
            alert("Username should not contain spaces");
            return 0
          }
          else if (!isValidServerUser) {
            alert("Username should not contain special characters.");
            return 0
          }
          else if(Number.isInteger(serverNameChar0)){
            alert("Server name should not start with a number");
            return 0
          }
          else if(serverName.indexOf(' ') >= 0){
            alert("Server name should not contain spaces");
            return 0
          }
          else if (!isValidServerName) {
            alert("Username should not contain special characters.");
            return 0
          }
          else{
            const serverDetails = {
            serverName : serverName,
            sshKey : ssh,
            ipAddr : ipAddr,
            user : serverUser,
            password : serverPassword,
            username: signInState[1]
          }

        Axios.post("/users/addserver", serverDetails)
        .then((response)=>{
            if( (response.data === "New Server Created!") | (response.data === "Added server to list of existing servers")){
                alert(response.data);
                navigate("/");
            }
            else{
                alert(response.data);
            }
        })
    }
}
    return(
        <div className="main-body">
            <h1 className="header font center">Add Server</h1>
            <Card style={{ maxHeight: "60%", minHeight: "40%", backgroundColor: "white", boxShadow: "4px 4px 4px 4px  #525151ad", borderRight: "20px solid rgba(0, 73, 230, 0.795)" }}>
        <CardContent>
            <form
            onSubmit={(e)=>{
                e.preventDefault();
                verifyAndSendDetails();
            }}>
                <div className="form-content">
                    <label htmlFor="server-label"
                    style = {{color: 'black', fontSize: 15}}>
                        Servername
                        <input
                        id="servername"
                        value={serverName}
                        placeholder="Servername"
                        type="text"
                        onChange={(e) => setServerName(e.target.value)}
                        />
                    </label>

                    <label htmlFor="ipAddr-label"
                    style = {{color: 'black', fontSize: 15}}>
                        IP Address
                        <input
                        id="ipAddress"
                        value={ipAddr}
                        placeholder="IP Address"
                        type="text"
                        onChange={(e)=>setIpAddr(e.target.value)}
                        />
                    </label>
                    <label htmlFor="serverUser"
                    style = {{color: 'black', fontSize: 15}}>
                        Username of Server
                        <input
                        id="serverUser"
                        value={serverUser}
                        placeholder="ServerUser"
                        type="text"
                        onChange={(e)=>setServerUser(e.target.value)}
                        />
                    </label>
                    <label htmlFor="serverPassword"
                    style = {{color: 'black', fontSize: 15}}>
                        Password of Server
                        <input
                        id="serverPassword"
                        value={serverPassword}
                        placeholder="serverPassword"
                        type="text"
                        onChange={(e)=>setServerPassword(e.target.value)}
                        />
                    </label>
                    &emsp;
                    </div>
                    <button className="waves-effect waves-green btn">Add Server!</button>
            </form>
            </CardContent>
            </Card>
        </div>
    )
}
export default Addserver;

//Resending it

