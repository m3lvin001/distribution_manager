import React, { Component } from "react";
import "../components/components.css";
import Login from "./Login";

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "default",
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.setDefault = this.setDefault.bind(this);
  }

  changeHandler(e) {
    this.setState({ user: e.target.value });
  }
  setDefault() {
    this.setState({ user: "default" });
  }

  render() {
    return (
      <div className="Home">
        <div className="center">
          {this.state.user === "default" ? (
            <>
              <h2>Let's Start ..</h2>
              <select onChange={this.changeHandler} value={this.state.user}>
                <option value="user">Select user</option>
                <option value="vendor">Vendor</option>
                <option value="customers">Customer</option>
                <option value="deliverer">Deliverer</option>
              </select>
            </>
          ) : (
            <Login user={this.state.user} setUserId={this.props.setUserId} back={this.setDefault} />
          )}
        </div>
      </div>
    );
  }
}

export default Home;
