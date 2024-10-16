import { navigate } from "@reach/router";
import axios from "axios";
import React, { Component } from "react";
import { ReactComponent as CartSvg } from "../svgs/cart.svg";

export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartItems: [],
      amount: 0,
      customerId: props.customerId,
      orderDesc: [],
    };
    this.getCartItems = this.getCartItems.bind(this);
    this.getTotal = this.getTotal.bind(this);
  }

  componentDidMount() {
    this.getCartItems();
  }

  getTotal() {
    let items = this.state.cartItems;
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total = total + items[i].price * items[i].quantity;
    }
    this.setState({ amount: total });
  }

  getCartItems() {
    axios
      .get(`/cart-items`)
      .then((res) => {
        let orderDesc = res.data.map((items, index) => items.itemId);
        this.setState({ cartItems: res.data, orderDesc: orderDesc }, () =>
          this.getTotal()
        );
      })
      .catch((err) => alert(err.message));
  }

  render() {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <CartSvg style={{ width: "40%", height: "50vh", margin: "20px" }} />
        <div
          className="box product noheight noshadow"
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
          }}
        >
          <div
            className="form-header"
            style={{
              width: "100%",
              textAlign: "left",
              fontWeight: "bold",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            Cart Items {this.state.orderDesc.toString()}
          </div>
          <div className="row1" style={{ width: "100%" }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Description</td>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    Quantity
                  </td>
                  <td>UnitPrice</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {this.state.cartItems.map((o, i) => (
                  <Tr
                    id={o.id}
                    itemId={o.itemId}
                    desc={o.description}
                    price={o.price}
                    quantity={o.quantity}
                    update={this.getCartItems}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <hr />
          <div
            style={{
              width: "100%",
              textAlign: "left",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ width: "60%" }}>
              <label style={{ fontWeight: "bold" }}>Total Amount: </label>{" "}
              <label>Ksh{this.state.amount}.00</label>
            </div>
            <div style={{ width: "40%" }}>
              <button
                style={{ margin: "5px auto", width: "100%" }}
                onClick={() =>
                  navigate("checkout", {
                    state: {
                      amount: this.state.amount,
                      desc: this.state.orderDesc.toString(),
                      customerId: this.state.customerId,
                    },
                  })
                }
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Tr extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      itemId: props.itemId,
      desc: props.desc,
      price: props.price,
      quantity: props.quantity,
      image: "",
    };
    this.setQuantity = this.setQuantity.bind(this);
    this.getProductDetails = this.getProductDetails.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.getProductDetails();
  }

  setQuantity() {
    axios
      .post(`/update-quantity`, { id: this.state.id, q: this.state.quantity })
      .then((res) => {
        this.props.update();
      })
      .catch((err) => alert(err.message));
  }

  getProductDetails() {
    axios
      .get(`/product-details/${this.state.itemId}`)
      .then((res) => {
        this.setState({
          desc: res.data[0].title,
          image: res.data[0].image,
        });
      })
      .catch((err) => alert(err.message));
  }
  remove(id) {
    axios
      .post(`/remove-cart-item`, { id: id })
      .then((res) => {
        this.props.update();
      })
      .catch((err) => alert(err.message));
  }

  render() {
    const { price, desc, quantity, image } = this.state;
    return (
      <tr>
        <td>
          <img
            src={`/images/${image}.jpg`}
            alt="avator"
            style={{ width: "100px", height: "50px" }}
          />
        </td>
        <td>{desc}</td>
        <td
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <button
            style={{ width: "unset", margin: "unset", padding: "5px" }}
            onClick={() =>
              this.setState({ quantity: Number(quantity) + 1 }, () =>
                this.setQuantity()
              )
            }
          >
            +
          </button>
          <span style={{ border: "1px solid black", padding: "2px 5px" }}>
            {quantity}
          </span>
          <button
            style={{ width: "unset", margin: "unset", padding: "5px" }}
            onClick={() =>
              this.setState(
                { quantity: quantity <= 1 ? quantity : Number(quantity) - 1 },
                () => this.setQuantity()
              )
            }
          >
            -
          </button>
        </td>
        <td>{price}.00</td>
        <td>
          <button onClick={() => this.remove(this.props.id)}>Remove</button>
        </td>
      </tr>
    );
  }
}
