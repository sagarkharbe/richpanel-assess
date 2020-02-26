import React, { Component } from "react";
import api from "../shared/customAxios";
import { apiUrl } from "../shared/vars";
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  TextField,
  Button,
  Divider,
  Avatar
} from "@material-ui/core";
import { observer } from "mobx-react";
import moment from "moment";
import { appStore } from "../store/appStore";
import Header from "../components/Header";
import { withRouter } from "react-router-dom";
import SocketClient from "../shared/socketClient";
import {
  MentionsPlaceHolder,
  ChatPlaceholder
} from "../components/PlaceHolder";
import InfoColumn from "../components/InfoColumn";
import ChatItem from "../components/ChatItem";
import TweetItem from "../components/TweetItem";

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
    console.log(reply);
    return (
      <div
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <Header logout={this.logout}></Header>
        <div
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: ""
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Paper
                style={{
                  height: "92vh",
                  overflow: "scroll"
                }}
              >
                <List
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    padding: 0
                  }}
                >
                  {this.state.isLoading ? (
                    Array(10)
                      .fill(0, 0)
                      .map(e => <MentionsPlaceHolder />)
                  ) : this.state.tweets.length > 0 ? (
                    this.state.tweets.map((o, i) => (
                      <TweetItem
                        tweet={o}
                        selectedIndex={this.state.selectedIndex}
                        handleReply={s => this.handleReply(s)}
                        handleSelected={(id_str, o) =>
                          this.handleSelected(id_str, o)
                        }
                      ></TweetItem>
                      // <>
                      //   <ListItem
                      //     key={o.id.toString()}
                      //     selected={this.state.selectedIndex !== o.id_str}
                      //     onClick={() => {
                      //       this.handleReply("@" + o.user.screen_name + " ");
                      //       this.handleSelected(o.id_str, o);
                      //     }}
                      //   >
                      //     <div style={{ width: "3.10em", height: "3.10em" }}>
                      //       <img
                      //         src={o.user.profile_image_url}
                      //         style={{
                      //           width: "100%",
                      //           height: "100%",
                      //           display: "block",
                      //           borderRadius: "3em"
                      //         }}
                      //       />
                      //     </div>
                      //     <div style={{ marginLeft: "10px", maxWidth: "80%" }}>
                      //       <b style={{ fontSize: "1em" }}>
                      //         {o.user.name}{" "}
                      //         <span
                      //           style={{
                      //             fontWeight: "normal",
                      //             fontSize: "0.8em"
                      //           }}
                      //         >
                      //           {moment(o.created_at).fromNow()}
                      //         </span>
                      //       </b>
                      //       <p>
                      //         <span style={{ fontSize: "0.8em" }}>
                      //           {o.text}
                      //         </span>
                      //       </p>
                      //     </div>
                      //   </ListItem>
                      //   <Divider />
                      // </>
                    ))
                  ) : (
                    <span>No mentioned tweets found</span>
                  )}
                </List>
              </Paper>
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
                  <Paper style={{ height: "70vh" }}>
                    <List
                      style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column"
                      }}
                    >
                      {this.state.isLoading ? (
                        <ChatPlaceholder></ChatPlaceholder>
                      ) : selectedTweet ? (
                        <ChatItem
                          style={{
                            marginLeft: "1%",
                            backgroundColor: "#FBFBFB"
                          }}
                          item={selectedTweet}
                        ></ChatItem>
                      ) : (
                        <span style={{ margin: "auto" }}>
                          Select any Tweet to view!
                        </span>
                      )}
                      {replies &&
                        selectedTweet &&
                        replies[selectedTweet.id] &&
                        replies[selectedTweet.id].map((o, i) => (
                          <ChatItem
                            style={{
                              marginLeft: "35%",
                              backgroundColor: "#d8edb8"
                            }}
                            item={o}
                          ></ChatItem>
                        ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      flexDirection: "column",
                      marginLeft: "10px",
                      marginRight: "10px"
                    }}
                  >
                    <Button
                      style={{
                        borderBottomColor: "blue",
                        borderBottomWidth: "2px",
                        borderBottomStyle: "solid",
                        borderRadius: 0
                      }}
                    >
                      Reply
                    </Button>
                    <Button>Note</Button>
                    <Divider />
                    <TextField
                      id="outlined-full-width"
                      name="reply"
                      fullWidth
                      multiline
                      rows="4"
                      value={reply}
                      onChange={this.handleInputChange}
                      variant={"outlined"}
                      style={{ backgroundColor: "white", marginTop: "10px" }}
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
                  </div>
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
      </div>
    );
  }
}

export default observer(withRouter(DashBoard));
