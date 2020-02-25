import React, { Component } from "react";
import api from "../shared/customAxios";
import { apiUrl } from "../shared/vars";
import {
  Container,
  Grid,
  Paper,
  withStyles,
  List,
  ListItem,
  TextField,
  InputAdornment,
  IconButton,
  Button
} from "@material-ui/core";
import { observer } from "mobx-react";
import moment from "moment";
import { appStore } from "../store/appStore";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import SocketClient from "../shared/socketClient";
import UserInfo from "./UserInfo";
import Progress from "./Progress";

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      tweets: [],
      selectedTweet: null,
      selectedIndex: null,
      replies: {},
      reply: ""
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
    const { replies, selectedIndex, selectedTweet, reply, tweets } = this.state;
    console.log(reply);
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          marginHorizontal: "10%"
        }}
      >
        <Header logout={this.logout}></Header>
        {!this.state.isLoading ? (
          <UserInfo user={this.state.user}></UserInfo>
        ) : (
          <div style={{ height: "15vh" }}></div>
        )}
        <div style={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper
                style={{ padding: "10px", height: "75vh", overflow: "scroll" }}
              >
                <List
                  style={{ display: "flex", flex: 1, flexDirection: "column" }}
                >
                  {this.state.isLoading ? (
                    <Progress></Progress>
                  ) : this.state.tweets.length > 0 ? (
                    this.state.tweets.map((o, i) => (
                      <ListItem
                        key={i.toString()}
                        selected={this.state.selectedIndex === i}
                        onClick={() => {
                          this.handleReply("@" + o.user.screen_name + " ");
                          this.handleSelected(i, o);
                        }}
                      >
                        <div style={{ width: "3.10em", height: "3.10em" }}>
                          <img
                            src={o.user.profile_image_url}
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "block",
                              borderRadius: "3em"
                            }}
                          />
                        </div>
                        <div style={{ paddingLeft: "0.4em" }}>
                          <b style={{ fontSize: "1em" }}>
                            {o.user.name}{" "}
                            <span
                              style={{
                                fontWeight: "normal",
                                fontSize: "0.8em"
                              }}
                            >
                              {moment(o.created_at).fromNow()}
                            </span>
                          </b>
                          <p>
                            <span style={{ fontSize: "0.8em" }}>{o.text}</span>
                          </p>
                        </div>
                      </ListItem>
                    ))
                  ) : (
                    <span>No mentioned tweets found</span>
                  )}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper style={{ padding: "10px", height: "75vh" }}>xs=12</Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                style={{
                  padding: "10px",
                  height: "75vh",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Grid item xs={12}>
                  <Paper style={{ height: "60vh" }}>
                    <List
                      style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column"
                      }}
                    >
                      {selectedTweet && (
                        <ListItem
                          style={{
                            margin: "1%",
                            width: "80%",
                            borderTop: "3px #0c458b solid",
                            boxShadow: "2px 9px 15px rgba(191, 191, 191, 0.5)"
                          }}
                        >
                          <p style={{ fontSize: "1em", marginRight: "5px" }}>
                            {selectedTweet.text}
                          </p>
                          <p style={{ fontSize: "0.8em" }}>
                            {moment(selectedTweet.created_at).fromNow()}
                          </p>
                        </ListItem>
                      )}
                      {replies &&
                        selectedTweet &&
                        replies[selectedTweet.id] &&
                        replies[selectedTweet.id].map((o, i) => (
                          <ListItem
                            key={i.toString()}
                            style={{
                              margin: "1%",
                              width: "60%",
                              marginLeft: "39%",
                              textAlign: "right",
                              borderTop: "3px #0c458b solid",
                              boxShadow: "2px 9px 15px rgba(191, 191, 191, 0.5)"
                            }}
                          >
                            <p style={{ fontSize: "1em", marginRight: "5px" }}>
                              {o.text}
                            </p>
                            <p style={{ fontSize: "0.8em" }}>
                              {moment(o.created_at).fromNow()}
                            </p>
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    style={{
                      margin: "3%",
                      display: "flex",
                      flexDirection: "row"
                    }}
                  >
                    <TextField
                      id="filled-multiline"
                      name="reply"
                      fullWidth
                      multiline
                      rows="3"
                      value={reply}
                      onChange={this.handleInputChange}
                      variant="filled"
                      InputProps={{
                        endAdornment: (
                          <Button
                            color="primary"
                            variant="contained"
                            style={{ borderRadius: "10%" }}
                            onClick={() => {
                              this.postReplies({
                                reply,
                                selectedTweet,
                                replies
                              });
                            }}
                          >
                            Reply
                          </Button>
                        )
                      }}
                    ></TextField>
                  </Paper>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default observer(withRouter(DashBoard));
