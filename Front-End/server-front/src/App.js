import React from "react";
import "./App.css";
import Signupin from "./signupin";
import Signup from "./signup";
import {Router} from "@reach/router";
import Home from "./Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Home path="/"></Home>
      <Signupin path="/signupin"/>
      <Signup path = "/signup"/>
      </Router>
      
    </div>
  );
}

export default App;
