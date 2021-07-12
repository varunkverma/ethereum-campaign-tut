import React from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <Container>
      <Navbar />
      {children}
    </Container>
  );
}

export default Layout;
