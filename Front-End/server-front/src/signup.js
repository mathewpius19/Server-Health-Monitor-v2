import { useState } from "react";
import React from "react";
import axios from "axios";
import { Link, redirectTo } from "@reach/router";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  function verifyDetails() {

    const userChar0 = parseInt(username.charAt(0));
    var regex = /^[A-Za-z0-9 ]+$/ //Regular expression containing special characters
    var isValidPass = regex.test(password);
    var isValidUser = regex.test(username);
      if (!isValidPass) {
        alert("Password should not contain special characters."); 
      }
      else if(password.indexOf(' ') >= 0){
        alert("Password should not contain spaces");
      }
      else if(Number.isInteger(userChar0)){
        alert("Username should not start with a number")
      }
      else if(username.indexOf(' ') >= 0){
        alert("Username should not contain spaces");
      }
      else if (!isValidUser) {
        alert("Username should not contain special characters.");
      }

    if (password !== password2) {
      alert("Passwords do not match"); //Checks if initially entered password matches the verification password
    } else {
      if (
        (username === "") |
        (password === "") |
        (email === "") |
        (firstName === "") |
        (lastName === "")
      ) {
        alert("Form is not complete");
        return 0;
      }

      const formData = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        servers: [],
      };
      console.log("Sending post request");
      axios
        .post("/users/signup", formData)
        .then((response) => alert(response.data));
    }
  }

  return (
    <div className="main-body">
      <h1 className="header font center red-text">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyDetails();
        }}
      >
        <div className="form-content">
          <label htmlFor="username-label"
          style = {{color: '#5d4037', fontSize: 15}}>
            Username
            <input
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label htmlFor="password-label"
          style = {{color: '#5d4037', fontSize: 15}}>
            Password
            <input
              id="password"
              value={password}
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label htmlFor="retypePassword-label"
          style = {{color: '#5d4037', fontSize: 15}}>
            Retype Password
            <input
              id="retype-password"
              value={password2}
              placeholder="Retype-Password"
              type="password"
              onChange={(e) => setPassword2(e.target.value)}
            />
          </label>

          <label htmlFor="email-label"
          style = {{color: '#5d4037', fontSize: 15}}>
            Email
            <input
              id="email"
              placeholder="user123@mail.com"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label htmlFor="firstName-label"
          style = {{color: '#5d4037', fontSize: 15}}>
            FirstName
            <input
              id="firstName"
              placeholder="FirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label htmlFor="lastName-label"
          style = {{color: '#5d4037', fontSize: 15, fontFamily:'sans-serif'}}>
            LastName
            <input
              id="lastName"
              value={lastName}
              placeholder="LastName"
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <button className="waves-effect waves-green btn">Submit</button>
        <Link to="/signupin" style={{ textDecoration: "none", color: "red", fontSize: 11, fontFamily:'sans-serif' }}>
        Already have an account?Click here to log in!
      </Link>
      </form>

    </div>
  );
};
export default Signup;

//Resending it