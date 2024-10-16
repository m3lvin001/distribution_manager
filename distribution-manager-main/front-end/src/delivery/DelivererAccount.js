import React, { Component } from "react";
import PersonalInfo from "../components/PersonalInfo";
import Security from "../components/Security";
export class DelivererAccount extends Component {
  render() {
    return (
      <div>
        <PersonalInfo user="deliverer" userId={this.props.userId} />
        <Security user="deliverer" userId={this.props.userId} />
      </div>
    );
  }
}

export default DelivererAccount;
