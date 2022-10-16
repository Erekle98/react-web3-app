import React, { useState } from "react";
import { Modal, Message } from "semantic-ui-react";

const WarningMessage = ({ header }) => {
  const [open, setOpen] = useState(true);

  return (
    <Modal onClose={() => setOpen(false)} open={open}>
      <Message negative size="huge">
        <Message.Header>{header}</Message.Header>
      </Message>
    </Modal>
  );
};

export { WarningMessage };
