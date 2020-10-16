import Axios from "axios";
import React, { useContext, useState } from "react"
import SignInContext from "./signInContext"
import {navigate} from "@reach/router";
const Addserver=()=>{
    const [signInState, setSignInState] = useContext(SignInContext);
    const [serverName, setServerName] = useState("");
    const [sshKey, setSshKey] = useState(false);
    const [ipAddr, setIpAddr] = useState("");
    const [serverUser, setServerUser] = useState("");
    const [serverPassword, setServerPassword] = useState("");
    const verifyAndSendDetails= ()=>{
        const ssh=false;
        if((serverName === "") | (serverPassword === "") |(ipAddr==="") | (serverName==="")) {
            alert("Form data not complete");
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
            <form 
            onSubmit={(e)=>{
                e.preventDefault();
                verifyAndSendDetails();
            }}>
                <div className="form-content">
                    <label htmlFor="server-label">
                        Servername
                        <input 
                        id="servername"
                        value={serverName}
                        placeholder="Servername"
                        type="text"
                        onChange={(e) => setServerName(e.target.value)}
                        />
                    </label>
                    
                    <label htmlFor="ipAddr-label">
                        IP Address
                        <input
                        id="ipAddress"
                        value={ipAddr}
                        placeholder="IP Address"
                        type="text"
                        onChange={(e)=>setIpAddr(e.target.value)}
                        />
                    </label>
                    <label htmlFor="serverUser">
                        Username of Server
                        <input
                        id="serverUser"
                        value={serverUser}
                        placeholder="ServerUser"
                        type="text"
                        onChange={(e)=>setServerUser(e.target.value)}
                        />
                    </label>
                    <label htmlFor="serverPassword">
                        Password of Server
                        <input
                        id="serverPassword"
                        value={serverPassword}
                        placeholder="serverPassword"
                        type="text"
                        onChange={(e)=>setServerPassword(e.target.value)}
                        />
                    </label>
                    </div>
                    <button className="waves-effect waves-green btn">Submit</button>
            </form>
        </div>
    )
}
export default Addserver;