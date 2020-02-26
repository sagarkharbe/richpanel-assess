import React from "react";
import { mount, shallow } from "enzyme";
import ChatItem from "./ChatItem";

const mockTweet = {
  user: {
    name: "test",
    profile_image_url: "string",
    created_at: "00:00:00",
    text: "some text"
  }
};

describe("Chat Item", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <ChatItem
        style={{
          marginLeft: "1%",
          backgroundColor: "#FBFBFB"
        }}
        item={mockTweet}
      />
    );
  });

  test("renders component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("renders children", () => {
    expect(wrapper.find(".MuiAvatar-img")).toHaveLength(1);
    expect(wrapper.find(".user-name")).toHaveLength(1);
    expect(wrapper.find(".user-tweet")).toHaveLength(1);
    expect(wrapper.find(".created-at")).toHaveLength(1);
  });
});
