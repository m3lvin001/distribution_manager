import { Link} from "@reach/router";
import axios from "axios";
import React, { Component } from "react";
import "../components/components.css";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      pass: "",
      message: "",
    };
    this.authenticate = this.authenticate.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
  }

  inputHandler(e) {
    this.setState({ [e.target.name]: e.target.value, message: "" });
  }

  authenticate() {
    const { email, pass } = this.state;
    axios
      .post(`/auth-user/${this.props.user}`, { email, pass })
      .then((res) => {
        if (res.data.available) {
          this.props.setUserId(res.data.userId, `/${this.props.user}`);
        } else {
          this.setState({ message: "Login failed" });
        }
      })
      .catch((err) => alert(err.message));
  }

  render() {
    return (
      <div className="Login">
        <span onClick={this.props.back}>
          <i className="fas fa-times-circle" />
        </span>
        <h3>{this.props.user} Login</h3>
        <input
          type="email"
          placeholder="user email"
          value={this.state.email}
          name="email"
          onChange={this.inputHandler}
        />
        <input
          type="password"
          placeholder="password"
          value={this.state.pass}
          name="pass"
          onChange={this.inputHandler}
        />
        <div className="row2" style={{ color: "red",textAlign:"center",margin:"10px auto",width:"40%" }}>
          {this.state.message}
        </div>
        <button className="button" onClick={this.authenticate}>
          Login
        </button>
        <Link to="/register" state={{ user: this.props.user }}>
          Register
        </Link>
      </div>
    );
  }
}

export default Login;
