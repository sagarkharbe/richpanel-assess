import React, { useState, useEffect } from "react";
import { Container, Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import api from "../shared/customAxios";
import { apiUrl } from "../shared/vars";

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

const verify = async (query, props) => {
  const res = await api.post(
    `${apiUrl}/api/auth/twitter`,
    JSON.stringify({ ...query })
  );

  if (!res.headers["x-auth-token"]) {
    window.alert("Please try again later");
    return;
  } else {
    window.localStorage.setItem("rp_token", res.headers["x-auth-token"]);
    setTimeout(() => {
      props.history.push("/dashboard");
    }, 1000);
  }
};

function LoginPage(props) {
  const [isLoading, setLoading] = useState(false);

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
    <Container maxWidth="sm" style={{ paddingTop: "25px" }}>
      <b>Welcome to Rich Panel Twitter HelpDesk</b>
      <b>Login or Register via Twitter</b>
      <Button variant="contained" color="primary" onClick={() => login()}>
        Twitter
      </Button>
    </Container>
  );
}

export default withRouter(LoginPage);
