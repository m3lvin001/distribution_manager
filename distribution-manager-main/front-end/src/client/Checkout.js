import { Link, navigate } from "@reach/router";
import axios from "axios";
import React, { Component } from "react";
import Mpesa from "../svgs/mpesa.png";

export default class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customerId: this.props.location.state.customerId,
      orderDescription: this.props.location.state.desc,
      amount: this.props.location.state.amount,
      paymentMode: "",
      physicalAddress: "",
      phone: "",
      orderId: ""
    };
    this.setCash = this.setCash.bind(this);
    this.setMpesa = this.setMpesa.bind(this);
    this.setMpesaPhone = this.setMpesaPhone.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  setCash(e) {
    this.clearBorder();
    this.setState({ paymentMode: "cash" }, () => {
      e.target.style.border = "3px solid blue";
      console.log(this.state.paymentMode);
    });
  }

  clearBorder() {
    let mode = document.querySelectorAll(".mode");
    for (let i = 0; i < mode.length; i++) {
      mode[i].style.border = "none";
    }
  }

  setMpesa(e) {
    this.clearBorder();
    this.setState({ paymentMode: "mpesa" }, () => {
      e.target.style.border = "3px solid green";
      console.log(this.state.paymentMode);
    });
  }
  setMpesaPhone(phone, paddress) {
    this.setState({ phone: phone, physicalAddress: paddress });
  }

  clearCart(orderId) {
    axios
      .post("/move-to-order-items", {
        orderDescription: this.state.orderDescription,
        orderId: orderId,
        customerId: this.state.customerId
      })
      .then((res) => {
        axios.post(`/clear-cart`, { customerId: this.state.customerId });
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  placeOrder() {
    const businessNumber = "174379";
    const {
      customerId,
      orderDescription,
      amount,
      phone,
      paymentMode,
      physicalAddress,
    } = this.state;

    axios
      .post(`/new-order`, {
        customerId,
        orderDescription,
        amount,
        phone,
        paymentMode,
        physicalAddress,
        businessNumber
      })
      .then((res) => {
        this.clearCart(res.data);
        alert(`Order placed successfully`);
        navigate("my-orders");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  render() {
    return (
      <div>
        <PurchaseDetails
          customerId={this.state.customerId}
          desc={this.state.orderDescription}
          amount={this.state.amount}
          mode={this.state.paymentMode}
        />
        <Address
          customerId={this.state.customerId}
          setMpesaPhone={this.setMpesaPhone}
        />
        <Payment setCash={this.setCash} setMpesa={this.setMpesa} />
        <div
          style={{ width: "60%", margin: "50px auto", boxShadow: "unset" }}
          className="box product noheight noshadow"
        >
          <button
            style={{
              width: "100%",
              backgroundColor: "seagreen",
              padding: "20px",
              color: "ButtonFace",
            }}
            onClick={this.placeOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    );
  }
}

export class Payment extends Component {
  render() {
    return (
      <div>
        <div
          className="box product noheight noshadow"
          style={{
            width: "60%",
            margin: "50px auto",
          }}
        >
          <div className="form-header" style={{ width: "100%" }}>
            Select Payment
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <img
              className="box product noheight mode"
              style={{ width: "30%", height: "130px", zIndex: "99" }}
              onClick={this.props.setMpesa}
              src={Mpesa}
              alt="avator"
            />
            <div
              className="box product noheight mode"
              style={{ width: "30%", height: "130px" }}
              onClick={this.props.setCash}
            >
              {" "}
              Cash On Delivery
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: {},
    };
  }

  componentDidMount() {
    this.getDetails();
  }

  getDetails() {
    axios.get(`/user-address/${this.props.customerId}`).then((res) => {
      this.setState(
        {
          address: res.data[0],
        },
        () =>
          this.props.setMpesaPhone(
            res.data[0].phone,
            res.data[0].physicalAddress
          )
      );
    });
  }

  render() {
    const { address } = this.state;
    return (
      <div
        className="box product noheight noshadow"
        style={{ width: "60%", margin: "50px auto" }}
      >
        <div
          className="form-header"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          Delivery Address
          <Link to="/customers/account">
            Change <i className="fas fa-pen" />
          </Link>
        </div>
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
    );
  }
}

export class PurchaseDetails extends Component {
  render() {
    return (
      <div
        className="box product noheight noshadow"
        style={{ width: "60%", margin: "50px auto" }}
      >
        <div className="form-header" style={{ width: "100%" }}>
          Order Details
        </div>
        <div className="row2">
          <label>CustomerId</label>
          <div>{this.props.customerId}</div>
        </div>
        <div className="row2">
          <label>Description (item no.)</label>
          <div>{this.props.desc}</div>
        </div>
        <div className="row2">
          <label>Amount</label>
          <div>Ksh. {this.props.amount}</div>
        </div>
        <div className="row2">
          <label>Payment:</label>
          <div>{this.props.mode}</div>
        </div>
      </div>
    );
  }
}
