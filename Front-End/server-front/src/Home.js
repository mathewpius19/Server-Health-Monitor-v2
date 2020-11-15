import React, { useContext } from "react";
import { Link } from "@reach/router";
import SignInContext from "./signInContext";
import Profile from "./profile";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const Home = () => {
  const [signInState, setSignInState] = useContext(SignInContext);
  if (signInState[0] === "Signed Out") {
    return (
     
      <div className="main-body" id="root">
        <h1 className="header font center ">Server Health Monitor</h1>
          <div className="description">
            <p className=" black-text font text-darken-3 flow-text img-container">
            <img src= "https://cdn.haproxy.com/wp-content/uploads/2019/02/image2-2.png" width="70%" height="70%"/>
            A website created to monitor your Linux remote servers of any origin.✨
              </p>
          </div>
            <p><Link
              to="/signup"
              style={{ textDecoration: "none", color: "black", fontFamily: "sans-serif", fontWeight: "bolder", fontSize: 15}}
            >
              Don't have an account? Click here to create one!
            </Link>
            </p>
            <p>
            <Link
              to="/signupin"
              style={{ textDecoration: "none", color: "black",  fontFamily: "sans-serif", fontWeight: "bolder", fontSize: 15 }}
            >
              Already have an account?  Click here to login!
            </Link>
            </p>
          </div>
          
        
      
     
    );
  } else {
    return (
      
      <Profile
        status={signInState[0]}
        username={signInState[1]}
        password={signInState[2]}
      ></Profile>
      
    );
  }
};
export default Home;
