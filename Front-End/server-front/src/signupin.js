import React, { useContext, useState } from "react";
import { Link, navigate } from "@reach/router";
import axios from "axios";
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
      <h1 className="header font center">Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyDetails();
        }}
      >
        <div className="form-content">
          <label htmlFor="user-label">
            Username
            <input
              id="username"
              value={username}
              placeholder="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label htmlFor="password-label">
            Password
            <input
              id="password"
              value={password}
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button className="waves-effect waves-green btn">Submit</button>
        <Link to="/signup" style={{ textDecoration: "none", color: "red" }}>
          Dont have an account?Click here to create one!
        </Link>
      </form>
    </div>
  );
};
export default Signupin;
