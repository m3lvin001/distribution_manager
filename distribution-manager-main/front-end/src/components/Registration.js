import { navigate } from "@reach/router";
import axios from "axios";
import React, { Component } from "react";
import "../components/components.css";

export class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      physicalAddress: "",
      pass:"",
      user: this.props.location.state.user,
    };
    this.addNewUser = this.addNewUser.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
  }

  inputHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  addNewUser() {
    const { firstname, lastname, phone, email, physicalAddress,pass } = this.state;
    axios
      .post(`/add-user/${this.state.user}`, {
        firstname,
        lastname,
        phone,
        email,
        physicalAddress,
        pass
      })
      .then((res) => {
        alert("Registration successful");
        navigate("/");
      })
      .catch((err) => alert(err.message));
  }

  render() {
    const inputStyle = {
      width: "70%",
    };
    return (
      <div className="Home">
        <div className="center" style={{ width: "50%", margin: "50px auto" }}>
          <div
            className="form-header"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#800080b0",
              color: "white",
            }}
          >
            <span>{this.props.location.state.user} Registration</span>
            <span onClick={() => navigate("/")}>
              <i className="fas fa-times-circle" />
            </span>
          </div>
          <div className="row2">
            <input
              style={inputStyle}
              onChange={this.inputHandler}
              value={this.state.firstname}
              name="firstname"
              type="text"
              placeholder="firstname"
            />
          </div>
          <div className="row2">
            <input
              style={inputStyle}
              onChange={this.inputHandler}
              value={this.state.lastname}
              name="lastname"
              type="text"
              placeholder="lastname"
            />
          </div>
          <div className="row2">
            <input
              style={inputStyle}
              onChange={this.inputHandler}
              value={this.state.phone}
              name="phone"
              type="text"
              placeholder="phone"
            />
          </div>
          <div className="row2">
            <input
              style={inputStyle}
              onChange={this.inputHandler}
              value={this.state.email}
              name="email"
              type="email"
              placeholder="email"
            />
          </div>
          <div className="row2">
            <input
              style={inputStyle}
              onChange={this.inputHandler}
              value={this.state.physicalAddress}
              name="physicalAddress"
              type="text"
              placeholder="physical address"
            />
          </div>
          <div className="row2">
            <input
              style={inputStyle}
              onChange={this.inputHandler}
              value={this.state.pass}
              name="pass"
              type="password"
              placeholder="set password"
            />
          </div>
          <div className="row2">
            <button onClick={this.addNewUser} className="registerbtn">
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;
