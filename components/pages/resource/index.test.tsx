import { shallow } from "enzyme";
import { shallowToJson } from "enzyme-to-json";
import { useRouter } from "next/router";

import { useRedirectIfLoggedOut } from "../../../src/effects/auth";
import IndexPage from "./index";

jest.mock("../../../src/effects/auth");
jest.mock("next/router");

describe("Index page", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => {
      return {
        query: {
          iri: encodeURIComponent("https://mypod.myhost.com"),
        },
      };
    });
  });

  test("Renders a logout button", () => {
    const tree = shallow(<IndexPage />);
    expect(shallowToJson(tree)).toMatchSnapshot();
  });

  test("Redirects if the user is logged out", () => {
    shallow(<IndexPage />);
    expect(useRedirectIfLoggedOut).toHaveBeenCalled();
  });
});
