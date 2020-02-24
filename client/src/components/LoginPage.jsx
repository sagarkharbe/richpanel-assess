import React, { useState, useEffect, createContext, useContext } from "react";
import { Container, Button, Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import api from "../shared/customAxios";
import { apiUrl } from "../shared/vars";
import { observer } from "mobx-react";
import { appStore } from "../store/appStore";
import Icon from "@mdi/react";
import { mdiTwitter } from "@mdi/js";

const login = async () => {
  const res = await api.post(`${apiUrl}/api/auth/twitter/reverse`);
  console.log(res.data.oauth_token);
  if (res.data && res.data.oauth_token) {
    window.location.href =
      "https://api.twitter.com/oauth/authenticate?oauth_token=" +
      res.data.oauth_token;
  } else {
    window.alert("ERROR : " + res.message);
  }
};

function LoginPage(props) {
  const [isLoading, setLoading] = useState(false);

  const verify = async (query, props) => {
    setLoading(true);
    const res = await api.post(
      `${apiUrl}/api/auth/twitter`,
      JSON.stringify({ ...query })
    );

    if (!res.headers["x-auth-token"]) {
      window.alert("Please try again later");
      appStore.changeLoginState(false, null, "");
      return;
    } else {
      appStore.changeLoginState(true, null, res.headers["x-auth-token"]);
      props.history.push("/dashboard");
    }
  };

  useEffect(() => {
    var search = window.location.search.substring(1);
    if (search) {
      const query = JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
      if (query && Object.keys(query).length > 0) {
        verify(query, props);
      }
    }
  }, []);

  return (
    <Container
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Typography variant="h3" gutterBottom>
        Getting Started
      </Typography>
      <Button
        disabled={isLoading}
        variant="contained"
        size="large"
        color="primary"
        aria-label="add"
        style={{ marginTop: "20px" }}
        startIcon={<Icon path={mdiTwitter} color="white" size={1} />}
        onClick={() => {
          setLoading(true);
          login();
        }}
      >
        Login with Twitter
      </Button>
    </Container>
  );
}

export default observer(withRouter(LoginPage));
