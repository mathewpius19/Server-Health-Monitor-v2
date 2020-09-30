import { useState } from "react";
import React from "react";
import axios from "axios";
import { Link } from "@reach/router";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  function verifyDetails(){
    if(password!=password2){
      alert("Passwords do no match");
    }
    else{
        if(username===""|password===""|email===""|firstName===""|lastName===""){
          alert("Form is not complete")
        }
        return 0
      }
    
   
  
    
      const formData = {
        firstname:firstName,
        lastname:lastName,
        username:username,
        password:password,
        email:email,
        servers:[],
      };
      console.log("Sending post request");
      axios.post("/users/signup", formData)
      .then((response)=>console.log(response.data))
      }

    
    
  

  return (
    <div className="sign-up">
      <h1>Register</h1>
      <form id="signUp-form"
      onSubmit={(e)=>{
        e.preventDefault();
        verifyDetails();
      }}>
    
      <label htmlFor="username-label">
        Username
        <input
          id="username"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>

      <label htmlFor="password-label">
        Password
        <input
          id="password"
          value={password}
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label htmlFor="retypePassword-label">
        Retype Password
        <input
          id="retype-password"
          value={password2}
          placeholder="Retype-Password"
          type="password"
          onChange={(e) => setPassword2(e.target.value)}
        />
      </label>

      <label htmlFor="email-label">
        Email
        <input
          id="email"
          placeholder="user123@mail.com"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label htmlFor="firstName-label">
        FirstName
        <input
          id="firstName"
          placeholder="FirstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label htmlFor="lastName-label">
        LastName
        <input
          id="lastName"
          value={lastName}
          placeholder="LastName"
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <button class="waves-effect waves-teal btn-flat">Submit</button>
      </form>
      <Link to="/signupin" style={{textDecoration:"none",color:"red"}}>Already have an account?Click here to log in!</Link>
    </div>
  );
    }
export default Signup;
