import axios from "axios";
import React, { Component } from "react";

export default class Security extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: "",
      pass: "",
      cpass: "",
      message: "",
    };
    this.changes = this.changes.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
  }
  inputHandler(e) {
    this.setState({ [e.target.name]: e.target.value, message: "" });
  }
  changes() {
    const { current, pass, cpass } = this.state;
    if (cpass === pass) {
      axios
        .post(`/update-key/${this.props.user}/${this.props.userId}`, {
          current,
          pass,
        })
        .then((res) => {
          alert(res.data);
          this.setState({ current: "", cpass: "", pass: "" });
        })
        .catch((err) => alert(err.message));
    } else {
      this.setState({ message: "Passwords not matching" });
    }
  }

  render() {
    const inputStyle = {
      width: "100%",
    };
    return (
      <div
        className="box product noheight noshadow"
        style={{ width: "60%", margin: "50px auto" }}
      >
        <div
          className="form-header"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          Security
        </div>
        <div className="row2">
          <input
            style={inputStyle}
            type="text"
            placeholder="current password"
            name="current"
            value={this.state.current}
            onChange={this.inputHandler}
          />
        </div>
        <div className="row2">
          <input
            style={inputStyle}
            type="text"
            placeholder="new password"
            name="pass"
            value={this.state.pass}
            onChange={this.inputHandler}
          />
        </div>
        <div className="row2">
          <input
            style={inputStyle}
            type="text"
            placeholder="confirm password"
            name="cpass"
            value={this.state.cpass}
            onChange={this.inputHandler}
          />
        </div>
        <div className="row2" style={{ color: "red" }}>
          {this.state.message}
        </div>
        <div className="row2">
          <button onClick={this.changes}>Save</button>
        </div>
      </div>
    );
  }
}
