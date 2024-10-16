import axios from "axios";
import React, { Component } from "react";
import { DeliveryForm } from "../delivery/Delivery";

export class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      deliverers: [
        { id: 21, firstname: "Washington", lastname: "Omondi" },
        { id: 21, firstname: "Mark", lastname: "Otieno" },
        { id: 21, firstname: "Domitila", lastname: "Munee" },
        { id: 21, firstname: "James", lastname: "Karanja" },
        { id: 21, firstname: "Bruce", lastname: "Onyango" },
        { id: 21, firstname: "William", lastname: "Owino" },
      ],
      more: false,
      orderId: "",
      paymentMode: "",
      customerId: "",
      delivererId: "",
      delivererName: "",
    };
    this.getDeliverer = this.getDeliverer.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getEverything = this.getEverything.bind(this);
    this.assign = this.assign.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentDidMount() {
    this.getEverything();
  }
  changeHandler(e) {
    this.setState(
      {
        delivererId: e.target.value.split("-")[0],
        orderId: e.target.name,
        delivererName:
          e.target.value.split("-")[1] + " " + e.target.value.split("-")[2],
      },
      () => {
        this.assign();
      }
    );
  }
  getEverything() {
    Promise.all([this.getAllOrders(), this.getDeliverer()])
      .then((result) => {
        const orders = result[0].data;
        const deliverers = result[1].data;
        this.setState({
          orders: orders,
          deliverers: deliverers,
        });
      })
      .catch((err) => alert(err.message));
  }

  getAllOrders() {
    return axios.get(`/all-orders`);
  }
  getDeliverer() {
    return axios.get(`/all-deliverers`);
  }
  assign() {
    axios
      .post(`/assign`, {
        orderId: this.state.orderId,
        delivererId: this.state.delivererId,
        delivererName: this.state.delivererName,
      })
      .then((res) => this.getEverything())
      .catch((err) => alert(err.message));
  }

  render() {
    let row = this.state.orders.map((o, i) => (
      <tr>
        <td>{o.id}</td>
        <td>{o.orderDescription}</td>
        <td>{o.paymentMode}</td>
        <td>{o.amount}.00</td>
        <td>{o.physicalAddress}</td>
        <td>
          <select
            style={{ margin: "unset", padding: "5px", width: "98%" }}
            value={o.delivererName}
            name={o.id}
            onChange={this.changeHandler}
          >
            <option>{o.delivererName}</option>
            {this.state.deliverers.map((d, i) => (
              <option value={`${d.id}-${d.firstname}-${d.lastname}`} key={i}>
                {d.firstname} {d.lastname}
              </option>
            ))}
          </select>
        </td>
        <td>
          <button
            style={{ margin: "unset", padding: "5px", width: "98%" }}
            onClick={() =>
              this.setState({
                more: true,
                orderId: o.id,
                paymentMode: o.paymentMode,
                customerId: o.customerId,
              })
            }
          >
            More <i className="fas fa-ellipsis-h" />
          </button>
        </td>
      </tr>
    ));

    return (
      <div>
        {this.state.more ? (
          <DeliveryForm
            vendor={true}
            back={() => this.setState({ more: false })}
            orderId={this.state.orderId}
            customerId={this.state.customerId}
            paymentMode={this.state.paymentMode}
          />
        ) : (
          <table>
            <thead>
              <tr>
                <td>ID</td>
                <td>Description</td>
                <td>Payment</td>
                <td>Amount</td>
                <td>Delivery Address</td>
                <td>Assign</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>{row}</tbody>
          </table>
        )}
      </div>
    );
  }
}

export default Orders;
