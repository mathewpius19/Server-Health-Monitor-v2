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
        <h1 className="header font center red-text">Server Health Monitor</h1>
          <div className="description">
            <p className=" black-text font center text-darken-3 flow-text">
            <img src= "main.jpg" width="50%" height="50%"/>
              </p>
          </div>
            <p><Link
              to="/signup"
              style={{ textDecoration: "none", color: "#5d4037", fontFamily: "sans-serif", fontSize: 15 }}
            >
              Dont have an account?Click here to create one!
            </Link>
            </p>
            <p>
            <Link
              to="/signupin"
              style={{ textDecoration: "none", color: "#5d4037", fontFamily: "sans-serif", fontSize: 15 }}
            >
              Already have an account?Click here to login!
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
