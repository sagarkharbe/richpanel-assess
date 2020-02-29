import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import api from "../../shared/customAxios";
import { apiUrl } from "../../shared/vars";
import { Grid, Paper } from "@material-ui/core";
import { observer } from "mobx-react";
import { appStore } from "../../store/appStore";
import Header from "../../components/Header/Header";
import { withRouter } from "react-router-dom";
import ReplyBox from "../../components/ReplyBox/ReplyBox";
import TweetList from "../../components/Tweets/TweetList";
import ChatList from "../../components/Chats/ChatList";
import InfoColumn from "../../components/Information/InfoColumn";

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
      replyButtonDisabled: false,
      reply: ""
    };
  }

  getTweets = async () => {
    return await api.get(`${apiUrl}/api/twitter/tweets`);
  };

  getUserReplies = async () => {
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
    appStore.updateUser(user);
    const allTweets = await this.getTweets();
    const [pass, fail] = allTweets.reduce(
      ([p, f], e) =>
        e.in_reply_to_status_id === null ? [[...p, e], f] : [p, [...f, e]],
      [[], []]
    );
    let replies = {};
    pass.forEach(e => (replies[e.id] = []));

    const userReplies = await this.getUserReplies();

    replies = await this.createTweetsThread(fail, userReplies, replies);

    console.log("replies ", replies);

    this.setState(
      {
        isLoading: false,
        user,
        tweets: pass,
        replies
      },
      () => this.initSockets()
    );
  };

  initSockets = async () => {
    const { user } = this.state;
    const socket = socketIOClient(apiUrl);
    socket.on("connect", async () => {
      console.log("Socket Connected! , Emitting screen Name", user.screen_name);
      socket.emit("register_screen_name", { term: user.screen_name });
      socket.on("tweets", tweet => {
        if (tweet.in_reply_to_status_id !== null) {
          this.handleIncomingReply(tweet);
        } else if (!this.state.tweets.some(o => o.id === tweet.id))
          this.setState({ tweets: [tweet].concat(this.state.tweets) });
      });
    });
    socket.on("disconnect", () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
    });
  };

  createTweetsThread = async (tweets, userReplies, replies) => {
    let combined = [...tweets, ...userReplies].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    for (let tweet of combined) {
      if (replies[tweet.in_reply_to_status_id])
        replies[tweet.in_reply_to_status_id].push(tweet);
      else {
        for (const replyArrId of Object.keys(replies)) {
          console.log(replies[replyArrId]);
          if (
            replies[replyArrId].some(
              reply => reply.id === tweet.in_reply_to_status_id
            )
          ) {
            replies[replyArrId].push(tweet);
            break;
          }
        }
      }
    }
    return replies;
  };

  handleIncomingReply = tweet => {
    let { replies } = this.state;
    if (replies[tweet.in_reply_to_status_id])
      replies[tweet.in_reply_to_status_id].push(tweet);
    else {
      for (const replyArrId of Object.keys(replies)) {
        if (
          replies[replyArrId].some(
            reply => reply.id === tweet.in_reply_to_status_id
          )
        ) {
          if (replies[replyArrId].some(reply => reply.id === tweet.id)) return;
          replies[replyArrId].push(tweet);
          break;
        }
      }
    }
    this.setState({ replies });
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
    if (this.state.selectedTweet === null) {
      window.alert("Please select a tweet to reply");
      return;
    }
    this.setState({ replyButtonDisabled: true });
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

    this.setState({
      reply: "@" + query.selectedTweet.user.screen_name + " ",
      replies,
      replyButtonDisabled: false
    });
  };

  logout = async () => {
    window.localStorage.clear();
    appStore.changeLoginState(false, null, "");
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
      isLoading,
      replyButtonDisabled
    } = this.state;
    return (
      <div
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <Header logout={this.logout} />

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
                  replyButtonDisabled={replyButtonDisabled}
                  handleInputChange={this.handleInputChange}
                  postReplies={() => {
                    this.postReplies({ reply, selectedTweet, replies });
                  }}
                ></ReplyBox>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <InfoColumn selectedTweet={selectedTweet} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default observer(withRouter(DashBoard));
