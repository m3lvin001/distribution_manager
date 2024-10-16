import React, { Component } from 'react'
import Header from '../components/Header'
import Navigation from '../components/navigation'

export default class Vendor extends Component {
    constructor(props) {
        super(props)
        this.links=[
            {to:"./",name:"Products",ico:"fas fa-newspaper"},
            {to:"orders",name:"Orders",ico:"fas fa-box-open"},
            {to:"deliveries",name:"Deliveries",ico:"fas fa-truck"},
        ]
        this.rightLinks = [
            { to: "account", name: "Account",ico:"fas fa-user" }
        ]

    }
    
    render() {
        return (
            <div>
                <Header title="Vendor"/>
                <Navigation links={this.links} right={true} rightLinks={this.rightLinks}  />
                {this.props.children}
            </div>
        )
    }
}

