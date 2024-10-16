import React, { Component } from "react";
import PersonalInfo from '../components/PersonalInfo'
import Security from "../components/Security";

export default class Account extends Component {
    render() {
        return (
            <div>
                <PersonalInfo user="customers" userId={this.props.customerId} />
                <Security user="customers" userId={this.props.customerId} />
            </div>
        )
    }
}



