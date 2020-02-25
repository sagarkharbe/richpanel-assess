import React from "react";

export default function UserInfo(props) {
  const { user } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: "15%",
        marginRight: "15%"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        <h2 style={{ color: "#3a4356" }}>
          Welcome,{" "}
          <span style={{ color: "#254d7a", fontSize: "1.7rem" }}>
            {user.name}
          </span>
        </h2>

        <span
          style={{
            fontSize: "1.5rem",
            color: "#1D9FEF",
            marginLeft: "10%",
            marginRight: "10%"
          }}
        >
          @{user.screen_name}
        </span>
        <span style={{ fontSize: "1.5rem" }}>{user.location}</span>
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
