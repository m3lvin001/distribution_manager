import React, { Component } from "react";
import axios from "axios";
import Card from "./Card";
export class Newspaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newspapers: [],
      customerId: this.props.customerId,
    };
  }

  componentDidMount() {
    this.getNewspapers();
  }

  getNewspapers() {
    axios
      .get(`/newspapers`)
      .then((res) => {
        this.setState({
          newspapers: res.data,
        });
      })
      .catch((err) => alert(err.message));
  }

  render() {
    let mags = this.state.newspapers.map((m, i) => (
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

export default Newspaper;
