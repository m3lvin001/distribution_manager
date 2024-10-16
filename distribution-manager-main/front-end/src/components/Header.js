import React, { Component } from 'react'

export class Header extends Component {
    render() {
        return (
            <div className="header" style={{width:"100%",padding:"20px",margin:"0px"}}>
                <h1>{this.props.title} Portal</h1>
            </div>
        )
    }
}

export default Header
