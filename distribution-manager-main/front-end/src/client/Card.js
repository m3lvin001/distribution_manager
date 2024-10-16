import axios from "axios";
import React, { Component } from "react";

export class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      btnText: "add to cart",
      bgColor: "#000000b9",
    };
    this.addToCart = this.addToCart.bind(this);
    this.checkCart = this.checkCart.bind(this);
  }

  componentDidMount() {
    this.checkCart();
  }

  checkCart() {
    axios
      .get(`/incart/${this.props.id}`)
      .then((res) => {
        if (res.data[0].incart) {
          this.setState({
            disabled: true,
            btnText: "In cart",
            bgColor: "grey",
          });
        }
      })
      .catch((err) => alert(err.message,'check cart'));
  }

  addToCart(customerId, itemId, price, quantity) {
    axios
      .post(`/add-to-cart`, { customerId, itemId, price, quantity })
      .then((res) => this.checkCart())
      .catch((err) => alert(err.message));
  }

  render() {
    return (
      <div className="box product noheight bshadow" style={{backgroundColor:"#00000015"}}>
        <img
          src={`/images/${this.props.image}.jpg`}
          style={{ width: "100%", height: "100px", borderRadius: "5px" }}
          alt="avator"
        />
        <div style={{ margin: "3px", width: "100%", textAlign: "left" }}>
          Category: {this.props.category}
        </div>
        <div style={{ margin: "3px", width: "100%", textAlign: "left" }}>
          Title: {this.props.title}
        </div>
        <div style={{ margin: "3px", width: "100%", textAlign: "left" }}>
          Price: {this.props.price}.00
        </div>
        <button
          style={{ backgroundColor: this.state.bgColor,color:"white",width:"90%"}}
          onClick={() => this.addToCart(1, this.props.id, this.props.price)}
          disabled={this.state.disabled}
        >
          {this.state.btnText}
        </button>
      </div>
    );
  }
}

export default Card;
