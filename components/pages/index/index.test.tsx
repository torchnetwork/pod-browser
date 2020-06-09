import { shallow } from "enzyme";
import { shallowToJson } from "enzyme-to-json";
import { fetchLitDataset, getThingOne, getIriAll } from "lit-solid";

import { useRedirectIfLoggedOut } from "../../../src/effects/auth";
import IndexPage, { getPodIrisFromWebId } from "./index";

jest.mock("../../../src/effects/auth");
jest.mock("lit-solid");

describe("Index page", () => {
  test("Renders a logout button", () => {
    const tree = shallow(<IndexPage />);
    expect(shallowToJson(tree)).toMatchSnapshot();
  });

  test("Redirects if the user is logged out", () => {
    shallow(<IndexPage />);
    expect(useRedirectIfLoggedOut).toHaveBeenCalled();
  });
});

describe("getPodIrisFromWebId", () => {
  test("Loads data from a webId", async () => {
    const iri = "https://mypod.myhost.com/profile/card#me";
    const iris = ["https://mypod.myhost.com/profile"];

    (fetchLitDataset as jest.Mock).mockResolvedValue({});
    (getThingOne as jest.Mock).mockImplementationOnce(() => {});
    (getIriAll as jest.Mock).mockImplementationOnce(() => iris);

    expect(await getPodIrisFromWebId(iri)).toEqual(iris);

    expect(fetchLitDataset).toHaveBeenCalled();
    expect(getThingOne).toHaveBeenCalled();
    expect(getIriAll).toHaveBeenCalled();
  });
});
