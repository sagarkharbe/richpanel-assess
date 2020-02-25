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
  Button,
  Typography,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { observer } from "mobx-react";
import moment from "moment";
import { appStore } from "../store/appStore";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import SocketClient from "../shared/socketClient";
import UserInfo from "./UserInfo";
import Progress from "./Progress";
import { MentionsPlaceHolder, ChatPlaceholder } from "./PlaceHolder";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoColumn from "./InfoColumn";

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
                      .map(e => <MentionsPlaceHolder></MentionsPlaceHolder>)
                  ) : this.state.tweets.length > 0 ? (
                    this.state.tweets.map((o, i) => (
                      <>
                        <ListItem
                          key={o.id.toString()}
                          selected={this.state.selectedIndex !== o.id_str}
                          onClick={() => {
                            this.handleReply("@" + o.user.screen_name + " ");
                            this.handleSelected(o.id_str, o);
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
                          <div style={{ marginLeft: "10px", maxWidth: "80%" }}>
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
                              <span style={{ fontSize: "0.8em" }}>
                                {o.text}
                              </span>
                            </p>
                          </div>
                        </ListItem>
                        <Divider />
                      </>
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
                        <ChatPlaceholder align={"start"}></ChatPlaceholder>
                      ) : (
                        selectedTweet && (
                          <ListItem
                            style={{
                              margin: "1%",
                              width: "80%",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#d3d3d3",
                              borderRadius: 20,
                              backgroundColor: "#FBFBFB"
                            }}
                          >
                            <div
                              style={{
                                width: "3.10em",
                                height: "3.10em",
                                marginRight: "10px"
                              }}
                            >
                              <img
                                src={selectedTweet.user.profile_image_url}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "block",
                                  borderRadius: "3em"
                                }}
                              />
                            </div>
                            <span>
                              <b>{selectedTweet.user.name}</b> <br />
                              <p
                                style={{
                                  fontSize: "1em",
                                  marginRight: "5px"
                                }}
                              >
                                {selectedTweet.text}
                              </p>
                              <p style={{ fontSize: "0.8em" }}>
                                {moment(selectedTweet.created_at).fromNow()}
                              </p>
                            </span>
                          </ListItem>
                        )
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
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#d3d3d3",
                              borderRadius: 20,
                              backgroundColor: "#d8edb8"
                            }}
                          >
                            <div
                              style={{
                                width: "3.10em",
                                height: "3.10em",
                                marginRight: "10px"
                              }}
                            >
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
                            <span>
                              <b>{o.user.name}</b> <br />
                              <p
                                style={{
                                  fontSize: "1em",
                                  marginRight: "5px"
                                }}
                              >
                                {o.text}
                              </p>
                              <p style={{ fontSize: "0.8em" }}>
                                {moment(o.created_at).fromNow()}
                              </p>
                            </span>
                          </ListItem>
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
