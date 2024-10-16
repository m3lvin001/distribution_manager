import React, { Component } from 'react'
import PersonalInfo from '../components/PersonalInfo'
import Security from '../components/Security'
export class VendorAccount extends Component {
    render() {
        return (
            <div>
                <PersonalInfo user="vendor" userId={this.props.vendorId} />
                <Security user="vendor" userId={this.props.vendorId} />
            </div>
        )
    }
}

export default VendorAccount
