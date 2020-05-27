import React, { useContext, ReactElement } from "react";
import { Link } from "@material-ui/core";
import LogOutButton from "../logout";
import UserContext from "../../src/contexts/UserContext";

export default function Header(): ReactElement {
  const { session } = useContext(UserContext);

  return (
    <nav>
      <Link>Inrupt</Link>
      <Link>
        <i className="prism-icon-add" />
      </Link>

      {session ? <LogOutButton /> : null}
    </nav>
  );
}
