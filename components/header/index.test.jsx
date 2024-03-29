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

import React from "react";
import { useRouter } from "next/router";
import { renderWithTheme } from "../../__testUtils/withTheme";
import mockSessionContextProvider from "../../__testUtils/mockSessionContextProvider";
import Header from "./index";
import mockSession, {
  mockUnauthenticatedSession,
} from "../../__testUtils/mockSession";

jest.mock("next/router");

describe("Header", () => {
  describe("with user logged in", () => {
    beforeEach(() => {
      useRouter.mockImplementation(() => ({
        query: {
          iri: "https://mypod.myhost.com",
        },
      }));
    });
    test("renders a header", () => {
      const session = mockSession();
      const SessionProvider = mockSessionContextProvider(session);

      const { asFragment } = renderWithTheme(
        <SessionProvider>
          <Header />
        </SessionProvider>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("with user logged out", () => {
    test("renders nothing", () => {
      const session = mockUnauthenticatedSession();
      const SessionProvider = mockSessionContextProvider(session);

      const { asFragment } = renderWithTheme(
        <SessionProvider>
          <Header />
        </SessionProvider>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
