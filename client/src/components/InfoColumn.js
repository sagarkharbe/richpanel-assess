import React from "react";
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
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function InfoColumn(props) {
  const { selectedTweet } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {selectedTweet && (
        <div>
          <div
            style={{
              // width: "80px",
              // height: "80px",
              alignItems: "center"
            }}
          >
            <img
              src={selectedTweet.user.profile_image_url}
              style={{
                width: "80px",
                height: "80px",
                display: "block",
                borderRadius: "3em"
              }}
            />
          </div>
          <b style={{ textAlign: "center", marginBottom: 20 }}>
            {selectedTweet.user.name}
          </b>
          <p>{selectedTweet.user.screen_name}</p>
          <p>Followers : {selectedTweet.user.followers_count}</p>
          <p>
            <Icon
              path={mdiMapMarker}
              color={"black"}
              size={0.7}
              style={{ marginRight: 10, padding: 0 }}
            />
            {selectedTweet.user.location}
          </p>
          <ExpansionPanel
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>Description</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{selectedTweet.user.description}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )}
    </div>
  );
}
