import React from "react";
import { Button, Divider, TextField } from "@material-ui/core";

export default function ReplyBox(props) {
  let { reply, handleInputChange, postReplies } = props;
  return (
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
        onChange={handleInputChange}
        variant={"outlined"}
        style={{ backgroundColor: "white", marginTop: "10px" }}
        InputProps={{
          endAdornment: (
            <Button
              className="reply"
              color="primary"
              variant="contained"
              style={{ borderRadius: "10%" }}
              onClick={postReplies}
            >
              Reply
            </Button>
          )
        }}
      ></TextField>
    </div>
  );
}
