import React, { Component } from "react";
import "./delivery.css";
import Header from "../components/Header";
import { ReactComponent as DeliveriesSvg } from "../svgs/deliveries.svg";
import { ReactComponent as DeliveredSvg } from "../svgs/delivered.svg";
import Navigation from "../components/navigation";
import { Link } from "@reach/router";
import axios from "axios";

export default class Delivery extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.links = [
      { to: "./", name: "Home" },
      { to: "orders", name: "Assigned Orders" },
      { to: "delivered", name: "Delivered" },
    ];

    this.rightLinks = [{ to: "account", name: "Account", ico: "fas fa-user" }];
  }

  render() {
    return (
      <div>
        <Header title="Delivery" />
        <Navigation
          links={this.links}
          right={true}
          rightLinks={this.rightLinks}
        />
        {this.props.children}
      </div>
    );
  }
}

export class DeliveryHome extends Component {
  render() {
    return (
      <div className="vendors home">
        <Link to="orders" className="box">
          <DeliveriesSvg
            className="svgs"
            style={{ maxWidth: "70%", height: "30%", margin: "20px auto" }}
          />
          <div>Orders/Deliveries(20)</div>
        </Link>
        <Link to="delivered" className="box">
          <DeliveredSvg
            className="svgs"
            style={{ maxWidth: "70%", height: "30%", margin: "20px auto" }}
          />
          <div>Delivered(50)</div>
        </Link>
      </div>
    );
  }
}

export class OrdersAssigned extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inView: "",
      orderId: "",
      customerId: "",
      paymentMode: "",
      assignedOrders: [],
    };
    this.back = this.back.bind(this);
  }
  componentDidMount() {
    this.getAssignedOrders();
  }

  getAssignedOrders() {
    axios
      .get(`/all-orders/${this.props.userId}`)
      .then((res) => {
        this.setState({ assignedOrders: res.data });
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  back() {
    this.setState({ inView: "" }, () => {
      this.getAssignedOrders();
    });
  }

  render() {
    return (
      <div className="vendors orders">
        {this.state.inView === "deliveryform" ? (
          <DeliveryForm
            back={this.back}
            orderId={this.state.orderId}
            customerId={this.state.customerId}
            paymentMode={this.state.paymentMode}
          />
        ) : (
          <table style={{ textAlign: "left" }}>
            <thead>
              <tr>
                <td>OrderId</td>
                <td>customerId</td>
                <td>Order Description</td>
                <td>Payment</td>
                <td>Delivery Address</td>
                <td>Delivery Status</td>
              </tr>
            </thead>
            <tbody>
              {this.state.assignedOrders.map((o, i) => (
                <tr
                  onClick={() =>
                    this.setState({
                      inView: "deliveryform",
                      orderId: o.id,
                      customerId: o.customerId,
                      paymentMode: o.paymentMode,
                    })
                  }
                >
                  <td>{o.id}</td>
                  <td>{o.customerId}</td>
                  <td>{o.orderDescription}</td>
                  <td>{o.paymentMode}</td>
                  <td>{o.physicalAddress}</td>
                  <td>{o.DS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export class Delivered extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deliveredOrders: [],
      userId: props.userId,
    };
  }

  componentDidMount() {
    if (this.props.vendor) {
      this.getDeliveredOrders("vendor", "all");
    } else {
      this.getDeliveredOrders("deliverer", this.state.userId);
    }
  }

  getDeliveredOrders(user, sort) {
    axios
      .get(`/delivered-orders/${user}/${sort}`)
      .then((res) => {
        this.setState({
          deliveredOrders: res.data,
        });
      })
      .catch((err) => alert(err.message));
  }

  render() {
    return (
      <div className="vendors delivered">
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Description (item no.)</td>
              <td>Amount</td>
              <td>Payment</td>
              <td>Delivery Address</td>
              <td>Payment Status</td>
              <td>Delivery Status</td>
            </tr>
          </thead>
          <tbody>
            {this.state.deliveredOrders.map((o, i) => (
              <tr>
                <td>{o.id}</td>
                <td>{o.orderDescription}</td>
                <td>{o.amount}</td>
                <td>{o.paymentMode}</td>
                <td>{o.physicalAddress}</td>
                <td>{o.PS}</td>
                <td>{o.DS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export class DeliveryForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderId: this.props.orderId,
      customerId: this.props.customerId,
      items: [],
      total: 0,
      paymentMode: this.props.paymentMode,
      paymentStatus: "Paid",
      amountPaid: 0,
      userAddress: {},
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.confirm = this.confirm.bind(this);
    this.confirmRequest = this.confirmRequest.bind(this);
  }

  componentDidMount() {
    this.getAll();
  }

  getAll() {
    Promise.all([this.getItems(), this.getUserAddress()])
      .then((res) => {
        this.setState(
          {
            userAddress: res[1].data[0],
            items: res[0].data,
          },
          () => {
            let items = this.state.items;
            let amount = 0;
            for (let i = 0; i < items.length; i++) {
              amount = amount + items[i].quantity * items[i].price;
            }
            this.setState({ total: this.state.total + amount });
          }
        );
      })
      .catch((err) => alert(err.message));
  }

  inputHandler(e) {
    this.setState({ amountPaid: e.target.value });
  }

  getItems() {
    return axios.get(`/order-items/${this.state.orderId}`);
  }
  getUserAddress() {
    return axios.get(`/user-address/${this.state.customerId}`);
  }

  confirm() {
    if (this.state.paymentMode === "cash") {
      if (this.state.amountPaid < this.state.total) {
        alert("Ensure to enter correct amount");
      } else {
        this.confirmRequest();
      }
    } else {
      this.confirmRequest();
    }
  }

  confirmRequest() {
    axios
      .get(`/confirm-order/${this.state.orderId}`)
      .then((res) => {
        this.props.back();
        alert("Order Confirmed");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  render() {
    let address = this.state.userAddress;
    return (
      <div>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{ width: "33%" }} className="sections">
            <div className="form-header">Items Confirmation</div>
            <div className="row1">
              <div className="row2" style={{ justifyContent: "space-evenly" }}>
                <div>
                  <label>orderId</label>
                  {this.props.orderId}
                </div>
                <div>
                  {" "}
                  <label>customerId</label>
                  {this.props.customerId}
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>item</td>
                    <td>Quantity</td>
                    <td>UnitPrice</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.items.map((o, i) => (
                    <TR key={i} id={o.itemId} quantity={o.quantity} price={o.price} />
                  ))}
                </tbody>
              </table>
            </div>
            <hr />
            <div className="row2">
              <label>Total</label>
              <div>Ksh{this.state.total}.00</div>
            </div>
          </div>

          <div style={{ width: "32%" }} className="sections">
            <div className="form-header">Payment Confirmation</div>
            <div className="row2">
              <label>Method:</label>
              <div>{this.state.paymentMode}</div>
            </div>
            <div className="row2">
              <label>Amount to be paid:</label>
              <div>{this.state.total}</div>
            </div>
            {this.props.vendor ? null : (
              <div className="row2">
                {this.state.paymentMode === "cash" ? (
                  <>
                    <label>If cash enter amount:</label>
                    <div>
                      <input
                        type="text"
                        onChange={this.inputHandler}
                        placeholder="amount"
                      />
                    </div>
                  </>
                ) : (
                  <label>Mpesa</label>
                )}
              </div>
            )}
          </div>

          <div style={{ width: "32%" }} className="sections">
            <div className="form-header">Delivery confirmation</div>
            <div className="row2">
              <label>Name</label>
              <div>
                {address.firstname} {address.lastname}
              </div>
            </div>
            <div className="row2">
              <label>Phone</label>
              <div>{address.phone}</div>
            </div>
            <div className="row2">
              <label>Email</label>
              <div>{address.email}</div>
            </div>
            <div className="row2">
              <label>Delivery Address:</label>
              <div>{address.physicalAddress}</div>
            </div>
          </div>
        </div>
        {this.props.vendor ? (
          <button
            onClick={this.props.back}
            style={{ padding: "10px", width: "10%", margin: "10px auto" }}
          >
            back
          </button>
        ) : (
          <>
            <button
              onClick={this.props.back}
              style={{ padding: "10px", width: "10%", margin: "10px auto" }}
            >
              back
            </button>
            <button
              onClick={this.confirm}
              style={{ padding: "10px", width: "10%", margin: "10px auto" }}
            >
              Confirm
            </button>
          </>
        )}
      </div>
    );
  }
}

class TR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "",
    };
  }

  componentDidMount() {
    this.getProductDetails();
  }

  getProductDetails() {
    axios
      .get(`/product-details/${this.props.id}`)
      .then((res) => {
        this.setState({
          item: res.data[0].title,
        });
      })
      .catch((err) => alert(err.message));
  }

  render() {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.state.item}</td>
        <td>{this.props.quantity}</td>
        <td>{this.props.price}.00</td>
      </tr>
    );
  }
}
