import React from "react";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Paper
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoCard from "./InfoCard";

export default function InfoColumn(props) {
  const { selectedTweet } = props;
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Paper
      style={{
        height: "92vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#EBEBEB"
      }}
    >
      {selectedTweet && (
        <div style={{ width: "100%" }}>
          <InfoCard selectedTweet={selectedTweet} />

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
              <span
                style={{
                  color: "#747880",
                  lineHeight: "1.5em",
                  fontSize: "1.1em"
                }}
              >
                {selectedTweet.user.description}
              </span>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>More Details</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <span
                style={{
                  color: "#747880",
                  lineHeight: "1.3em",
                  fontSize: "1.1em"
                }}
              >
                Lorem ipsum is placeholder text commonly used in the graphic,
                print, and publishing industries for previewing layouts and
                visual mockups.
              </span>
              <Typography></Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )}
    </Paper>
  );
}
