import React, { Component } from 'react'
import Header from '../components/Header'
import Navigation from '../components/navigation'

export class Client extends Component {
    constructor(props) {
        super(props)
        this.links = [
            { to: "./", name: "News papers" },
            { to: "magazines", name: "Magazines" },
            { to: "my-orders", name: "My Orders" },
        ]
        this.rightLinks = [
            { to: "cart", name: "Cart",ico:"fas fa-shopping-cart" },
            { to: "account", name: "Account",ico:"fas fa-user" }
        ]
    }

    render() {
        return (
            <div>
                <Header title="Client" />
                <Navigation links={this.links} right={true} rightLinks={this.rightLinks}  />
                {this.props.children}
            </div>
        )
    }
}

export default Client
