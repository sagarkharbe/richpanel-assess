import React from "react";
import { mount } from "enzyme";
import ReplyBox from "./ReplyBox";
import { jssPreset } from "@material-ui/core";

describe("Replybox component", () => {
  test("renders correctly", () => {
    const wrapper = mount(<ReplyBox />);
    expect(wrapper).toMatchSnapshot();
  });

  test("clicking reply sends tweet and resets text field", () => {
    const props = {
      reply: "@user ",
      handleInputChange: jest.fn(),
      postReplies: jest.fn()
    };
    const wrapper = mount(<ReplyBox {...props} />);

    const event = wrapper
      .find("textarea")
      .first()
      .props()
      .onChange("q");
    event && event();

    expect(props.handleInputChange).toBeCalledTimes(1);

    const reply = wrapper
      .find(".reply")
      .first()
      .props().onClick;

    reply && reply();
    expect(props.postReplies).toBeCalledTimes(1);
  });
  test("Reply button should disable while reply is posting", () => {
    const props = {
      replyButtonDisabled: true
    };
    const wrapper = mount(<ReplyBox {...props}></ReplyBox>);
    expect(
      wrapper
        .find(".reply")
        .first()
        .props().disabled
    ).toBeTruthy();
  });
});
