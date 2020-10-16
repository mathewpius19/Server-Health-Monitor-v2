import { navigate } from "@reach/router";
import React, { useContext } from "react";
import SignInContext from "./signInContext"

const Logout=()=>{
    const [signInState, setSignInState] = useContext(SignInContext);
    if(signInState[0]==="Signed In"){
        setSignInState(["Signed Out","None","None"]);
        navigate("/")
        return(
            <h1>Signing Out</h1>
        )}  
        else{
            return(
                <h1>Signed Out</h1>
            )
        }
};
export default Logout;