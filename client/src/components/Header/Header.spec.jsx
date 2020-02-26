import React from "react";
import { mount } from "enzyme";
import Header from "./Header";

const onPress = jest.fn();

describe("Header Component", () => {
  test("renders correctly", () => {
    const wrapper = mount(<Header />);
    expect(wrapper).toMatchSnapshot();
  });

  test("logout button", () => {
    const wrapper = mount(<Header logout={onPress} />);

    const event = wrapper
      .find("button")
      .first()
      .props().onClick;

    event && event();

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
