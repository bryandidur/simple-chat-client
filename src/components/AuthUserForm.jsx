import { useState} from 'react';
import { Col, Form, Row, Input, Button } from 'reactstrap';

export function AuthUserForm(props) {
  const {onSubmit} = props;
  const [name, setName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit(name);
  }

  function handleInputChange(event) {
    setName(event.target.value);
  }

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      <Row>
        <Col md="10">
          <Input type="text" placeholder="Enter your name..." onChange={handleInputChange} />
        </Col>
        <Col md="2">
          <Button color="primary" type="submit">Sign in</Button>
        </Col>
      </Row>
    </Form>
  );
}
