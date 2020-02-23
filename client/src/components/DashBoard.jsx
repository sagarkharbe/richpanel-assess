import React, { Component } from "react";
import api from "../shared/customAxios";
import { apiUrl } from "../shared/vars";
import { Container } from "@material-ui/core";
export default class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      tweets: [],
      selectedTweet: null
    };
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    this.init();
  }
  init = async () => {
    const user = await api.get(`${apiUrl}/api/twitter/self`);
    const tweets = await api.get(`${apiUrl}/api/twitter/tweets`);

    this.setState(
      {
        user,
        tweets
      },
      () => console.log(this.state)
    );
  };
  render() {
    return (
      <Container>
        <h2>DashBoard</h2>
      </Container>
    );
  }
}
