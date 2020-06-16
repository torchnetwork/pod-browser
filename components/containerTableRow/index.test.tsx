/* eslint-disable camelcase */
import React from "react";
import { shallow } from "enzyme";
import { shallowToJson } from "enzyme-to-json";
import * as litSolidHelpers from "../../src/lit-solid-helpers";
import ContainerTableRow, {
  handleTableRowClick,
  resourceHref,
  fetchResourceDetails,
} from "./index";

describe("ContainerTableRow", () => {
  test("it renders a table row", () => {
    const tree = shallow(<ContainerTableRow iri="iri" />);
    tree.simulate("click");
    expect(shallowToJson(tree)).toMatchSnapshot();
  });
});

describe("resourceHref", () => {
  test("it generates a resource link", () => {
    const link = resourceHref("https://example.com/example.ttl");
    expect(link).toEqual("/resource/https%3A%2F%2Fexample.com%2Fexample.ttl");
  });
});

describe("handleTableRowClick", () => {
  test("it opens the drawer and sets the menu contents", async () => {
    jest
      .spyOn(litSolidHelpers, "fetchResource")
      .mockImplementationOnce(async () => {
        return Promise.resolve({
          owner: { read: true, write: true, append: true, control: true },
          collaborator: {
            read: true,
            write: false,
            append: true,
            control: false,
          },
        });
      });

    const iri = "https://user.dev.inrupt.net/private/";
    const setMenuOpen = jest.fn();
    const setMenuContents = jest.fn();
    const handler = handleTableRowClick({
      classes: {},
      iri,
      setMenuOpen,
      setMenuContents,
    });

    const evnt = { target: document.createElement("tr") } as Partial<
      React.MouseEvent<HTMLInputElement>
    >;

    jest
      .spyOn(litSolidHelpers, "fetchResourceWithAcl")
      .mockImplementationOnce(async () => {
        return Promise.resolve({
          iri,
          types: ["Resource"],
          permissions: [
            {
              webId: "user",
              alias: "Full Control",
              acl: { read: true, write: true, append: true, control: true },
            },
          ],
        });
      });

    await handler(evnt);

    expect(setMenuOpen).toHaveBeenCalledWith(true);
    expect(setMenuContents).toHaveBeenCalled();
  });

  test("it commits no operation when the click target is an anchor", async () => {
    const iri = "https://user.dev.inrupt.net/private/";
    const setMenuOpen = jest.fn();
    const setMenuContents = jest.fn();

    const handler = handleTableRowClick({
      classes: {},
      iri,
      setMenuOpen,
      setMenuContents,
    });

    const evnt = { target: document.createElement("a") } as Partial<
      React.MouseEvent<HTMLInputElement>
    >;
    await handler(evnt);

    expect(setMenuOpen).not.toHaveBeenCalled();
    expect(setMenuContents).not.toHaveBeenCalled();
  });
});

describe("fetchResourceDetails", () => {
  test("it fetches the resource with acl, adding the name (shortened iri path)", async () => {
    const iri = "https://user.dev.inrupt.net/private/";

    jest
      .spyOn(litSolidHelpers, "fetchResourceWithAcl")
      .mockImplementationOnce(async () => {
        return Promise.resolve({
          iri,
          types: ["Resource"],
          permissions: [
            {
              webId: "user",
              alias: "Full Control",
              acl: { read: true, write: true, append: true, control: true },
            },
          ],
        });
      });

    const { name } = await fetchResourceDetails(iri);

    expect(litSolidHelpers.fetchResourceWithAcl).toHaveBeenCalledWith(iri);
    expect(name).toEqual("/private");
  });

  test("it fetches the resource with public (hard-coded) acl, and name when the container is public", async () => {
    const iri = "https://user.dev.inrupt.net/public/";
    jest
      .spyOn(litSolidHelpers, "fetchResource")
      .mockImplementationOnce(async () => {
        return Promise.resolve({
          iri,
          types: ["Resource"],
        });
      });

    const { name, permissions } = await fetchResourceDetails(iri);
    const { PUBLIC_PERMISSIONS } = litSolidHelpers;

    expect(litSolidHelpers.fetchResource).toHaveBeenCalledWith(iri);
    expect(name).toEqual("/public");
    expect(permissions).toMatchObject(PUBLIC_PERMISSIONS);
  });

  test("it fetches a file if the resource fetch fails", async () => {
    const iri = "https://user.dev.inrupt.net/private/";

    jest
      .spyOn(litSolidHelpers, "fetchResourceWithAcl")
      .mockImplementationOnce(() => {
        throw new Error("boom");
      });

    jest
      .spyOn(litSolidHelpers, "fetchFileWithAcl")
      .mockImplementationOnce(async () => {
        return Promise.resolve({
          iri,
          types: ["txt/plain"],
          file: "file contents",
          permissions: [
            {
              webId: "user",
              alias: "Full Control",
              acl: { read: true, write: true, append: true, control: true },
            },
          ],
        });
      });

    const { name } = await fetchResourceDetails(iri);

    expect(litSolidHelpers.fetchFileWithAcl).toHaveBeenCalledWith(iri);
    expect(name).toEqual("/private");
  });
});
