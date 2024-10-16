import axios from "axios";
import React, { Component } from "react";

export default class PersonalInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      physicalAddress: "",
    };
    this.changes = this.changes.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.getDetails = this.getDetails.bind(this);
  }

  componentDidMount() {
    this.getDetails();
  }
  inputHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  getDetails() {
    axios
      .get(`/account-details/${this.props.user}/${this.props.userId}`)
      .then((res) => {
        if (res.data.length===0) {
          alert("User doesnt exits")
        } else {
          this.setState({
            firstname: res.data[0].firstname,
            lastname: res.data[0].lastname,
            phone: res.data[0].phone,
            email: res.data[0].email,
            physicalAddress: res.data[0].physicalAddress,
          });
          
        }
      })
      .catch((err) => alert(err.message));
  }

  changes() {
    const { firstname, lastname, phone, email, physicalAddress } = this.state;

    axios
      .post(`/update/${this.props.user}/${this.props.userId}`, {
        firstname,
        lastname,
        phone,
        email,
        physicalAddress,
      })
      .then((res) => {
        alert("changes successful");
        this.getDetails();
      })
      .catch((err) => alert(err.message));
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
          <button onClick={this.changes}>Save</button>
        </div>
      </div>
    );
  }
}
