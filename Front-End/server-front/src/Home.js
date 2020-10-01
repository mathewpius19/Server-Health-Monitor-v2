import React from "react";
import {Link} from "@reach/router";

const Home=()=>{
    return(
        <div class="container">
    
        <h1 class="header font center blue-text">Server Health Monitor</h1>
        <div class="main-content">
        <div class="description">
            <p class=" gray-text font center text-darken-3 flow-text">
            This is a new and improved Server Health Monitor.
            Join now if you dont want to screw up your remote server! &#128526;
            </p>
            
        </div>
        <div><Link to = "/signup" style={{textDecoration:"none", color:"#5c8a8a"}}>Dont have an account?Click here to create one!</Link></div>
        <div><Link to="/signupin" style={{textDecoration:"none", color:"#5c8a8a"}}>Already have an account?Click here to login!</Link></div>
        </div>
        
        
        </div>
    )
}
export default Home;