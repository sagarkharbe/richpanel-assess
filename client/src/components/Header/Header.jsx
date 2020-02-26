import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";
import Icon from "@mdi/react";
import { mdiTwitter } from "@mdi/js";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}));

export default function Header(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Icon path={mdiTwitter} color="white" size={1} />
          <Typography
            variant="h6"
            style={{ marginLeft: "5px" }}
            className={classes.title}
          >
            Twitter Help Desk
          </Typography>
          <Button color="inherit" onClick={props.logout} size={"medium"}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
