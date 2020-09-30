import React, { useState } from "react";
import { Link } from "@reach/router";
import axios from "axios";

const Signupin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function verifyDetails() {
    if ((username === "") | (password === "")) {
      alert("Form data not complete");
    } else {
      const formData = {
        username: username,
        password: password,
      };
      axios.post("/users/signin",formData)
      .then((response)=>alert(response.data));
      
    }
  }

  return (
    <div className="Signupin-container">
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyDetails();
        }}
      >
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
        <button class="waves-effect waves-teal btn-flat">Submit</button>
        <Link to="/signup" style={{textDecoration: "none", color: "red" }}>
          Dont have an account?Click here to create one!
        </Link>
      </form>
    </div>
  );
};
export default Signupin;
