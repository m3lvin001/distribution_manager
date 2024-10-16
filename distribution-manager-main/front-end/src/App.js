import "./App.css";
import Home from "./components/Home";
import React, { Component } from "react";
import Delivery, {
  OrdersAssigned,
  Delivered,
  DeliveryHome,
} from "./delivery/Delivery";
import Client from "./client/Client";
import Vendor from "./vendor/Vendor";
import { navigate, Router } from "@reach/router";
import Products from "./vendor/Products";
import Orders from "./vendor/Orders";
import Newspaper from "./client/Newspaper";
import Magazines from "./client/Magazines";
import Journals from "./client/Journals";
import Account from "./client/Account";
import Cart from "./client/Cart";
import Myorders from "./client/Myorders";
import Checkout from "./client/Checkout";
import DelivererAccount from "./delivery/DelivererAccount";
import VendorAccount from "./vendor/VendorAccount";
import Registration from "./components/Registration";
// import Login from './components/Login';

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: 1,
    };
    this.setUser = this.setUser.bind(this);
  }
  setUser(userId,to) {
    this.setState({ userId:userId},()=>navigate(to));
  }
  render() {
    const { userId } = this.state;
    return (
      <Router>
        <Home path="/" setUserId={this.setUser}/>
        <Registration path="/register" />
        <Delivery path="/deliverer">
          <DeliveryHome userId={userId} path="/" />
          <OrdersAssigned userId={userId} path="orders" />
          <Delivered vendor={false} userId={userId} path="delivered" />
          <DelivererAccount userId={userId} path="account" />
        </Delivery>

        <Client path="/customers">
          <Newspaper customerId={userId} path="/" />
          <Magazines customerId={userId} path="magazines" />
          <Journals customerId={userId} path="journals" />
          <Account customerId={userId} path="account" />
          <Cart customerId={userId} path="cart" />
          <Myorders customerId={userId} path="my-orders" />
          <Checkout customerId={userId} path="checkout" />
        </Client>

        <Vendor path="/vendor">
          <Products vendorId={userId} path="/" />
          <Orders vendorId={userId} path="orders" />
          <Delivered vendor={true} vendorId={userId} path="deliveries" />
          <VendorAccount vendorId={userId} path="account" />
        </Vendor>
      </Router>
    );
  }
}

export default App;
