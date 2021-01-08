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

export default function styles(theme) {
  return {
    avatar: {
      marginRight: "1rem",
    },
    detailText: {
      fontSize: "0.75rem",
      textAlign: "left",
      flexGrow: 1,
    },
    "alert-container": {
      maxWidth: "100%",
    },
    action: {
      margin: 0,
      padding: 0,
      paddingRight: "5px",
    },
    alertBox: {
      fontSize: "13px",
      width: "100%",
      overflowWrap: "break-word",
      margin: "8px 0",
      padding: "6px",
    },
    alertMessage: {
      maxWidth: "50%",
      overflowWrap: "break-word",
    },
    alertIcon: {
      marginRight: "8px",
    },
    "avatar-container": {
      display: "flex",
      maxWidth: "100%",
      paddingRight: "16px",
      "& p": {
        overflowWrap: "break-word",
        marginRight: "16px",
        [theme.breakpoints.up("sm")]: {
          overflowWrap: "anywhere",
        },
      },
    },
    "bold-button": {
      fontWeight: "bold",
    },
    spinner: {
      margin: "20px",
    },
  };
}
