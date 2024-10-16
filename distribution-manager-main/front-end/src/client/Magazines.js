import React, { Component } from "react";
import axios from "axios";
import Card from "./Card";

export class Magazines extends Component {
  constructor(props) {
    super(props);

    this.state = {
      magazines: [],
    };
  }
  componentDidMount() {
    this.getMags();
  }

  getMags() {
    axios
      .get(`/magazines`)
      .then((res) => {
        this.setState({
          magazines: res.data,
        });
      })
      .catch((err) => alert(err.message));
  }

  render() {
    let mags = this.state.magazines.map((m, i) => (
      <Card
        key={i}
        id={m.id}
        price={m.price}
        category={m.category}
        title={m.title}
        image={m.image}
      />
    ));
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {mags}
      </div>
    );
  }
}

export default Magazines;
