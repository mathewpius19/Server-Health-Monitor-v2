import React, { useContext, useState } from "react";
import { Link, navigate } from "@reach/router";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import SignInContext from "./signInContext";
const Signupin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signInState, setSignInState] = useContext(SignInContext);

  function verifyDetails() {
    if ((username === "") | (password === "")) {
      alert("Form data not complete");
    } else {
      const formData = {
        username: username,
        password: password,
      };
      axios.post("/users/signin", formData).then((response) => {
        console.log(response);
        if (response.data === "Authentication Successful") {
          // alert(response.data);
          setSignInState(["Signed In", username, password]);
          navigate("/");
        } else {
          alert(response.data);
        }
      });
    }
  }

  return (
    <div className="main-body">
      <h1 className="header font center dark-blue-text">Login</h1>

      <Card style={{ maxHeight: "40%", minHeight: "40%", backgroundColor: "white", boxShadow: "4px 4px 4px 4px  #525151ad", borderRight: "20px solid rgba(0, 73, 230, 0.795)" }}>
        <CardContent>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyDetails();
        }}
      >
        <div className="form-content">
          <label htmlFor="user-label"
          style = {{color: 'black', fontSize: 15, fontFamily:'sans-serif'}}>
            Username
            <input
              id="username"
              value={username}
              placeholder="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label htmlFor="password-label"
          style = {{color: 'black', fontSize: 15, fontFamily:'sans-serif'}}>
            Password
            <input
              id="password"
              value={password}
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          &emsp;
        </div>
        <button className="waves-effect waves-green btn">Login</button>
      </form>
      <Button>
        <Link  to="/signup" style={{size:"small", color:"black", fontWeight:"bolder"}}>
          Don't have an account? Sign In!
          </Link>
        </Button>
      </CardContent>
      </Card>
    </div>
  );
};
export default Signupin;