import React, { Component } from "react";
import axios from "axios";
import {navigate} from "@reach/router";


class Profile extends Component {
  state = {
    username: this.props.username,
    password: this.props.password,
    servers: [],
    loading: true,
  };
  componentDidMount() {
    axios
      .post("/users/getservers", {
        username: this.state.username,
        password: this.state.password,
      })
      .then(({ data }) => {
        // console.log(this.state.username);
        // console.log(this.state.password);
        console.log(data);
        if (typeof data === "string") {
          alert(data);
        } else {
          this.setState({ servers: data, loading: false });
        }
      });
  }
  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    } else {
      const { servers } = this.state;
      return (
        <div className="main-body">
          <h2 className="center">{this.state.username}'s Servers</h2>
          
         
         
          <table className="centered striped">
            <thead>
              <tr>
                <th>Servername</th>
                <th>IP Address</th>
                <th>SSH Key (enabled:disabled)</th>
              </tr>
            </thead>
            <tbody>
              {servers.map(
                ({ serverName, ipAddr, sshKey, user, password }, index) => {
                  return (
                    <tr>
                      <td>{serverName}</td>
                      <td>{ipAddr}</td>
                      <td>
                        {sshKey ? "SSH Key enabled" : "Password access enabled"}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          <button
              className="waves-effect waves-green btn"
              onClick={()=>{navigate("/addserver")}}>
                Add Server
                </button>
        </div>
      );
    }
  }
}

export default Profile;
