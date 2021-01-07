/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {
  parseUrl,
  isUrl,
  stripQueryParams,
  normalizeContainerUrl,
  joinPath,
  getContainerUrl,
  getParentContainerUrl,
} from "./index";

describe("joinPath", () => {
  it("joins two strings with slash", () =>
    expect(joinPath("foo", "bar")).toEqual("foo/bar"));
  it("joins two strings with slash, and takes care to not get double slashes if first string ends with a slash", () =>
    expect(joinPath("foo/", "bar")).toEqual("foo/bar"));
});

describe("normalizeContainerUrl", () => {
  it("should leave urls with slash on the end alone", () =>
    expect(normalizeContainerUrl("http://example.com/")).toEqual(
      "http://example.com/"
    ));
  it("should normalize urls without slash on the end", () =>
    expect(normalizeContainerUrl("http://example.com")).toEqual(
      "http://example.com/"
    ));
});

describe("parseUrl", () => {
  test("it parses a given url into parts", () => {
    const {
      hash,
      host,
      hostname,
      origin,
      pathname,
      port,
      protocol,
      search,
    } = parseUrl("https://example.com:1000/path?query=param#hash");

    expect(hash).toEqual("#hash");
    expect(host).toEqual("example.com:1000");
    expect(hostname).toEqual("example.com");
    expect(origin).toEqual("https://example.com:1000");
    expect(pathname).toEqual("/path");
    expect(port).toEqual("1000");
    expect(protocol).toEqual("https:");
    expect(search).toEqual("?query=param");
  });

  test("it gracefully handles non-urls", () => {
    const {
      hash,
      host,
      hostname,
      origin,
      pathname,
      port,
      protocol,
      search,
    } = parseUrl("not a url");

    expect(hash).toEqual("");
    expect(host).toEqual("localhost");
    expect(hostname).toEqual("localhost");
    expect(origin).toEqual("http://localhost");
    expect(pathname).toEqual("/not%20a%20url");
    expect(port).toEqual("");
    expect(protocol).toEqual("http:");
    expect(search).toEqual("");
  });
});

describe("isUrl", () => {
  test("it returns true when given a string beginning with https", () => {
    expect(
      isUrl("https://ajacksified-dev.dev.inrupt.net/profile/card#me")
    ).toEqual(true);
  });

  test("it returns true when given a string beginning with http", () => {
    expect(
      isUrl("http://ajacksified-dev.dev.inrupt.net/profile/card#me")
    ).toEqual(true);
  });

  test("it returns false when given a mailto link", () => {
    expect(isUrl("mailto:example@example.com")).toEqual(false);
  });

  test("it returns false when given a url with no protocol", () => {
    expect(isUrl("ajacksified-dev.dev.inrupt.net/profile/card#me")).toEqual(
      false
    );
  });
});

describe("stripQueryParams", () => {
  test("it removes everything in a string after a ?", () => {
    expect(stripQueryParams("foo?bar=baz")).toEqual("foo");
  });
});

describe("getContainerUrl", () => {
  const resourceUrl = "https://www.example.org/stuff/photo.jpg";
  const containerUrl = "https://www.example.org/stuff/";
  test("it returns the url of the parent container of a given resource", () => {
    expect(getContainerUrl(resourceUrl)).toEqual(containerUrl);
  });
  test("it returns the same url when passed a container url", () => {
    expect(getContainerUrl(containerUrl)).toEqual(containerUrl);
  });
  it("allows passing undefined (can happen during build step)", () => {
    expect(getContainerUrl(undefined)).toBeUndefined();
  });
});

describe("getParentContainerUrl", () => {
  const resourceUrl = "https://www.example.org/stuff/photo.jpg";
  const containerUrl = "https://www.example.org/stuff/";
  test("it returns the url of the parent container of a given resource", () => {
    expect(getParentContainerUrl(resourceUrl)).toEqual(containerUrl);
  });
  const nestedContainerUrl = "https://www.example.org/stuff/nested/";
  test("it returns the url of the parent container of a given container", () => {
    expect(getParentContainerUrl(nestedContainerUrl)).toEqual(containerUrl);
  });
});
