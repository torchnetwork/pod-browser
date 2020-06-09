import { shallow } from "enzyme";
import { shallowToJson } from "enzyme-to-json";

import PodList from "./index";

describe("Pod list", () => {
  test("Renders null if there are no pod iris", () => {
    const iris = undefined;
    const tree = shallow(<PodList podIris={iris} />);
    expect(shallowToJson(tree)).toMatchSnapshot();
  });

  test("Renders a container if there is one pod iri", () => {
    const iris = ["https://mypod.myhost.com"];
    const tree = shallow(<PodList podIris={iris} />);

    expect(shallowToJson(tree)).toMatchSnapshot();
  });

  test("Renders a table if there are multiple pod iris", () => {
    const iris = [
      "https://mypod.myhost.com",
      "https://myotherpod.myotherhost.com",
    ];

    const tree = shallow(<PodList podIris={iris} />);
    expect(shallowToJson(tree)).toMatchSnapshot();
  });
});
