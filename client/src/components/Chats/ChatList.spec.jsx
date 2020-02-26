import React from "react";
import { mount, shallow } from "enzyme";
import ChatList from "./ChatList";

describe("Chat list component", () => {
  test("renders correctly", () => {
    const props = {
      isLoading: false,
      selectedTweet: {
        id: 3,
        user: {
          name: "test",
          profile_image_url: "string",
          created_at: "00:00:00",
          text: "some text"
        }
      },
      replies: {
        3: [
          {
            user: {
              name: "test",
              profile_image_url: "string",
              created_at: "00:00:00",
              text: "some text"
            }
          }
        ]
      }
    };

    const wrapper = mount(<ChatList {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find("ChatItem")).toHaveLength(2);
  });

  test("loads placeholders when component in loading state", () => {
    const props = {
      isLoading: true
    };

    const wrapper = mount(<ChatList {...props} />);

    expect(wrapper.find("ChatPlaceholder")).toHaveLength(1);
  });
});
