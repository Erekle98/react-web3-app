import React from "react";
import { Container } from "semantic-ui-react";

import { metamaskProvider } from "../ethereum/provider";
import { WarningMessage } from "./helpers/Message";
import Connection from "./Connection";

const App = () => {
  if (!metamaskProvider()) {
    return <WarningMessage header="You need a Metamask wallet to use this app" />;
  } else {
    return (
      <Container>
        <Connection />
      </Container>
    );
  }
};

export default App;
