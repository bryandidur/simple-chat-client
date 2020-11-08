import { useState } from 'react';
import { Row, Col, Form, Input, Button } from 'reactstrap';

export function ChatMessageForm(props) {
  const {disabled, onSubmit} = props;
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    setMessage('');

    onSubmit(message);
  }

  function handleInputChange(event) {
    setMessage(event.target.value);
  }

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      <Row>
        <Col md="10">
          <Input
            type="text"
            value={message}
            disabled={disabled}
            placeholder="Enter a message..."
            onChange={handleInputChange}
          />
        </Col>
        <Col md="2">
          <Button color="primary" type="submit" disabled={disabled}>Send</Button>
        </Col>
      </Row>
    </Form>
  );
}
