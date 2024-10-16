import React, { Component } from "react";
import axios from "axios";

export class Myorders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myorders: [],
    };
  }

  componentDidMount() {
    axios
      .get(`/client-orders/${this.props.customerId}`)
      .then((res) => {
        this.setState({ myorders: res.data });
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  render() {
    let row = this.state.myorders.map((o, i) => (
      <tr key={i}>
        <td>{o.id}</td>
        <td>{o.orderDescription}</td>
        <td>{o.paymentMode}</td>
        <td>{o.amount}</td>
        <td>{o.DS}</td>
        <td>{o.physicalAddress}</td>
      </tr>
    ));
    return (
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Description</td>
            <td>Payment</td>
            <td>Amount</td>
            <td>Delivery status</td>
            <td>Delivery Address</td>
            <td>{this.props.disabled}</td>
          </tr>
        </thead>
        <tbody>
          
          {row}
        </tbody>
      </table>
    );
  }
}

export default Myorders;
