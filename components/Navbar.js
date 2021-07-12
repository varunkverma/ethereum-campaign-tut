import React from "react";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "../routes";

function Navbar({}) {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">CrowdCoin</a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">
            <Button style={{ background: "none", padding: "0" }} icon="plus" />
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
}

export default Navbar;
