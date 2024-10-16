import axios from "axios";
import React, { Component } from "react";
import { ReactComponent as Newspaper } from "../svgs/newspaper.svg";

export class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [
        { id: 12, product: "Daily Nation", unitPrice: 10 },
        { id: 12, product: "Daily Nation", unitPrice: 10 },
        { id: 12, product: "Daily Nation", unitPrice: 10 },
        { id: 12, product: "Daily Nation", unitPrice: 10 },
        { id: 12, product: "Daily Nation", unitPrice: 10 },
      ],
      product: "",
      price: 0,
      category: "",
      image: "",
      showProduct: true,
      magImages: [
        "none",
        "gen",
        "cooking",
        "art",
        "fashion",
        "tech",
        "health",
        "children",
        "biz",
      ],
      newspaperImages: [
        "none",
        "tuko",
        "standardd",
        "daily-b",
        "pulse",
        "mpasho",
        "ghafla",
      ],
    };

    this.deleteProduct = this.deleteProduct.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.inputHandlers = this.inputHandlers.bind(this);
  }

  inputHandlers(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    this.getAllProducts();
  }

  getAllProducts() {
    axios
      .get("/all-products")
      .then((res) => {
        this.setState({ products: res.data });
      })
      .catch((err) => alert(err.message));
  }

  addProduct() {
    const { price, product, category, image } = this.state;
    axios
      .post("/add-product", { price, product, category, image })
      .then(() => {
        this.getAllProducts();
        this.setState({ showProduct: true });
      })
      .catch((err) => alert(err.message));
  }

  deleteProduct(productId) {
    axios
      .post("/delete-product", { productId: productId })
      .then(() => {
        alert("product deleted successfully");
        this.getAllProducts();
      })
      .catch((err) => alert(err.message));
  }

  render() {
    let products = this.state.products.map((p, i) => (
      <div className="box product noheight">
        <img
          src={`images/${p.image}.jpg`}
          style={{ width: "100%", height: "100px", borderRadius: "5px" }}
          alt="avator"
        />
        <div style={{ margin: "3px", width: "100%", textAlign: "left" }}>
          Category: {p.category}
        </div>
        <div style={{ margin: "3px", width: "100%", textAlign: "left" }}>
          Title: {p.title}
        </div>
        <div style={{ margin: "3px", width: "100%", textAlign: "left" }}>
          Price: {p.price}.00
        </div>
        <button
          style={{ backgroundColor: "coral" }}
          onClick={() => this.deleteProduct(p.id)}
        >
          Remove
        </button>
      </div>
    ));
    let magImages = this.state.magImages.map((n, i) => (
      <option value={n} key={i}>
        {n}
      </option>
    ));

    let newspaperImages = this.state.newspaperImages.map((n, i) => (
      <option value={n} key={i}>
        {n}
      </option>
    ));

    let imagesCategories =
      this.state.category === "magazine" ? magImages : newspaperImages;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {this.state.showProduct ? (
          <>
            <div
              className="box product noheight"
              onClick={() => this.setState({ showProduct: false })}
              style={{ color: "#5f9ea0" }}
            >
              <Newspaper
                style={{ width: "100%", height: "100px", borderRadius: "5px" }}
              />
              <i className="fas fa-plus" style={{ fontSize: "40px" }} />
              <div style={{ fontWeight: "bold" }}>Add New</div>
              <div style={{ fontWeight: "bold" }}>Product title</div>
              <div style={{ fontWeight: "bold" }}>Product category</div>
              <div style={{ fontWeight: "bold" }}>Product price</div>
            </div>
            {products}
          </>
        ) : (
          <div
            className="box product noheight noshadow"
            style={{ width: "60%" }}
          >
            <h3>Product details</h3>
            <input
              type="text"
              name="product"
              onChange={this.inputHandlers}
              placeholder="product title"
            />
            <label>Product Category</label>
            <select
              name="category"
              value={this.state.category}
              onChange={this.inputHandlers}
            >
              <option value="">none</option>
              <option value="magazine">Magazine</option>
              <option value="newspaper">News Paper</option>
            </select>
            <label>Image Category</label>
            <select
              value={this.state.image}
              name="image"
              onChange={this.inputHandlers}
            >
              {imagesCategories}
            </select>
            <input
              type="number"
              name="price"
              onChange={this.inputHandlers}
              placeholder="product price"
            />
            <button onClick={this.addProduct}>Add Product</button>
          </div>
        )}
      </div>
    );
  }
}

export default Products;
