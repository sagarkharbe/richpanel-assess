import React from "react";

export default function UserInfo(props) {
  const { user } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        <h2>{user.name}</h2>
        <h3>@{user.screen_name}</h3>
        <h3>{user.location}</h3>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <h4>{user.description}</h4>
      </div>
    </div>
  );
}
