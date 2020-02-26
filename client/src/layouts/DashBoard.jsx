import React, { Component } from "react";
import api from "../shared/customAxios";
import { apiUrl } from "../shared/vars";
import { Grid, Paper } from "@material-ui/core";
import { observer } from "mobx-react";
import { appStore } from "../store/appStore";
import Header from "../components/Header";
import { withRouter } from "react-router-dom";
import SocketClient from "../shared/socketClient";
import InfoColumn from "../components/InfoColumn";
import ReplyBox from "../components/ReplyBox";
import TweetList from "../components/TweetList";
import ChatList from "../components/ChatList";

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      tweets: [],
      userTweets: [],
      selectedTweet: null,
      selectedIndex: null,
      replies: {},
      reply: ""
    };
  }

  getTweets = async () => {
    return await api.get(`${apiUrl}/api/twitter/tweets`);
  };

  getUserTweets = async () => {
    return await api.get(`${apiUrl}/api/twitter/user/tweets`);
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
    const userTweets = await this.getUserTweets();
    this.setState(
      {
        isLoading: false,
        user,
        userTweets,
        tweets
      },
      () => console.log(this.state.userTweets)
    );
    SocketClient({
      getTweets: async () => {
        const tweets = await this.getTweets();
        this.setState({ tweets }, () => console.log(this.state.tweets, tweets));
      }
    });
  };

  handleSelected = (index, tweet) => {
    this.setState({
      selectedIndex: index,
      selectedTweet: tweet
    });
  };

  handleReply = str => {
    this.setState({
      reply: str
    });
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  postReplies = async query => {
    const { data } = await api.post(
      `${apiUrl}/api/twitter/postReplies`,
      JSON.stringify({
        inReplyToStatusId: query.selectedTweet.id_str,
        status: query.reply
      })
    );
    const replies = { ...query.replies };

    if (!replies[query.selectedTweet.id]) {
      replies[query.selectedTweet.id] = [];
    }
    replies[query.selectedTweet.id].push(data);

    this.setState(
      {
        reply: "@" + query.selectedTweet.user.screen_name + " ",
        replies
      },
      () => console.log(this.state.replies)
    );
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
    const {
      replies,
      selectedIndex,
      selectedTweet,
      reply,
      tweets,
      isLoading
    } = this.state;
    return (
      <div
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <Header logout={this.logout}></Header>

        <Grid container spacing={0}>
          <Grid item xs={3}>
            <TweetList
              isLoading={isLoading}
              tweets={tweets}
              selectedIndex={selectedIndex}
              handleReply={this.handleReply}
              handleSelected={this.handleSelected}
            ></TweetList>
          </Grid>

          <Grid item xs={6}>
            <Paper
              style={{
                height: "92vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#EBEBEB"
              }}
            >
              <Grid item xs={12}>
                <ChatList
                  isLoading={isLoading}
                  selectedTweet={selectedTweet}
                  replies={replies}
                ></ChatList>
              </Grid>

              <Grid item xs={12}>
                <ReplyBox
                  reply={reply}
                  handleInputChange={this.handleInputChange}
                  postReplies={() => {
                    this.postReplies({ reply, selectedTweet, replies });
                  }}
                ></ReplyBox>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper
              style={{
                height: "92vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#EBEBEB"
              }}
            >
              <InfoColumn selectedTweet={selectedTweet} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default observer(withRouter(DashBoard));
