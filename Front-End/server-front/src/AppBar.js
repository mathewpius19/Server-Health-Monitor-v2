import React, {useContext} from "react";
import { Link } from "@reach/router";
import SignInContext from "./signInContext";
const AppBar = ({ options, links, home }) => {
  const [signInState, setSignInState] = useContext(SignInContext);
  if(signInState[0]!=="Signed Out" && home){
    return (
      
        <div className="navbar-container">
          <Link to="/" className="logo dark-blue-text">
          Server Health Monitor
        </Link>
          <Link to="/logout" style={{color:"black"}}>Log Out</Link>
        </div>
    )
  }
  return (
      <div className="navbar-container">
        <Link to="/" className="logo">
          Server Health Monitor
        </Link>
        

        <ul>
          {options.map((item, index) => (
              <Link
              key={index}
              to={links[index]}
              style={{textDecoration:"none", color:"black"  }}
              >
              <li key={index}>{item}</li>
              </Link>
              
          ))}
        </ul>
        </div>
  );
};
export default AppBar;
