import React, { Component } from 'react'
import { Link } from '@reach/router'
import "../components/components.css";



export class navigation extends Component {
    render() {
        return (
            <div style={{ width: "100%", padding: "10px", display: "flex", flexDirection: "row" }} className="nav">
                <div style={{ width: "60%",display: "flex", flexDirection: "row", justifyContent: "flex-start"  }}>
                    {this.props.links.map((l, i) => (
                        <Link key={i} to={l.to} className="links"><i className={l.ico} /> {l.name}</Link>
                    ))}
                </div>
                {this.props.right ?
                    <div style={{ width: "40%", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                        {this.props.rightLinks.map((l, i) => (
                            <Link key={i} to={l.to} className="links"><i className={l.ico} /> {l.name}</Link>
                        ))}
                            <span onClick={()=>window.location.replace('/')} className="links"><i className="fas fa-sign-out-alt" />sign out</span>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default navigation
