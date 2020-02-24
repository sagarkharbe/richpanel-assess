import React, { Component } from "react";
import api from "../shared/customAxios";
import { apiUrl } from "../shared/vars";
import { Container } from "@material-ui/core";
import { observer } from "mobx-react";
import { appStore } from "../store/appStore";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import SocketClient from "../shared/socketClient";
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      tweets: [],
      selectedTweet: null
    };
  }

  getTweets = async () => {
    return await api.get(`${apiUrl}/api/twitter/tweets`);
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this.init();
  }
  init = async () => {
    const user = appStore.user
      ? appStore.user
      : await api.get(`${apiUrl}/api/twitter/self`);
    const tweets = await this.getTweets();
    this.setState({
      isLoading: false,
      user,
      tweets
    });
    // SocketClient({
    //   getTweets: async () => {
    //     const tweets = await this.getTweets();
    //     this.setState({ tweets });
    //   }
    // });
  };

  logout = async () => {
    window.localStorage.clear();
    appStore.changeLoginState(false, null, "");
    //wait for appStore to chage login state
    setTimeout(() => {
      this.props.history.push("/");
    }, 100);
  };
  render() {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          marginHorizontal: "10%",
          backgroundColor: "red"
        }}
      >
        <Header logout={this.logout}></Header>
        {!this.state.isLoading ? <h2>{this.state.user.name}</h2> : null}
      </div>
    );
  }
}

export default observer(withRouter(DashBoard));
