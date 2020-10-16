import React, { useContext, useState } from "react";
import "./App.css";
import Signupin from "./signupin";
import Signup from "./signup";
import { Router } from "@reach/router";
import Home from "./Home";
import Profile from "./profile";
import SignInContext from "./signInContext";
import AppBar from "./AppBar";
import Logout from "./Logout";
import Addserver from "./Addserver";
function App() {
  const signStateHook = useState(["Signed Out", "None", "None"]);
  const [signInState, setSignInState] = useContext(SignInContext);
  return (
    <React.StrictMode>
      <SignInContext.Provider value={signStateHook}>
        <div className="navbar-container">
          <Router>
            <AppBar
              options={["Home", "Sign In"]}
              links={["/", "/signupin"]}
              path="/signup"
            />
            <AppBar options={["Home"]} links={["/"]} path="/signupin" />
            <AppBar
              options={["Sign In"]}
              links={["/signupin"]}
              home={true}
              path="/"
            />
            <AppBar
            options={["Home"]}
            links={["/"]}
            path="/addserver"
            />
          </Router>
        </div>
        <Router>
          <Home path="/" />
          <Signupin path="/signupin" />
          <Signup path="/signup" />
          <Profile path="/profile" />
          <Logout path="/logout" />
          <Addserver path="/addserver"/>
        </Router>
      </SignInContext.Provider>
    </React.StrictMode>
  );
}

export default App;
