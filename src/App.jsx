import { useState} from 'react';
import { Container, Row, Col, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { AuthUserForm } from './components/AuthUserForm';
import { ChatCard } from './components/ChatCard';

function createWebSocketConnection(authUser) {
  const connection = new WebSocket(`ws://localhost:8080?user=${authUser}`);

  connection.onopen = () => console.log('WebSocket connected!');
  connection.onerror = (error) => console.log('WebSocket error:', error);
  connection.onclose = () => console.log('WebSocket disconnected!');

  return connection;
}

export function App() {
  const [authUser, setAuthUser] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [wsConnection, setWsConnection] = useState();
  const [currentChatUser, setCurrentChatUser] = useState(null);

  function addMessage(messagesKey, user, message) {
    setMessages((oldMessages) => {
      const keyMessages = oldMessages[messagesKey];
      const newKeyMessages = [...(keyMessages || []), {user, message}];

      return {
        ...oldMessages,
        [messagesKey]: newKeyMessages,
      };
    });
  }

  function handleAuthUserSubmit(authUserName) {
    const connection = createWebSocketConnection(authUserName);

    connection.onmessage = function (event) {
      const {type, payload} = JSON.parse(event.data);

      if (type === 'chat/user-connected') {
        setUsers((oldUsers) => {
          return [...oldUsers, payload];
        });
      }

      if (type === 'chat/user-disconnected') {
        setUsers((oldUsers) => {
          const remainingUsers = oldUsers.filter((user) => user.name !== payload.name);

          if (!remainingUsers.length) {
            setCurrentChatUser(null);
          }

          return remainingUsers;
        });

        setMessages((oldMessages) => {
          delete oldMessages[payload.name];

          return oldMessages;
        });
      }

      if (type === 'chat/active-users') {
        setUsers(() => {
          return payload.filter((user) => user.name !== authUserName);
        });
      }

      if (type === 'chat/received-message') {
        addMessage(payload.user, payload.user, payload.message);
      }
    };

    setAuthUser(authUserName);
    setWsConnection(connection);
  }

  function handleMessageSubmit(message) {
    addMessage(currentChatUser, authUser, message);

    wsConnection.send(JSON.stringify({
      type: 'chat/send-message',
      payload: {toUser: currentChatUser, message},
    }));
  }

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md="10">
          {!authUser ? <AuthUserForm onSubmit={handleAuthUserSubmit} /> : null}

          {
            authUser
            ? <>
                <h5>Welcome {authUser}, start chatting now!</h5>
                <Card>
                    <CardBody className="py-0 px-0">
                      <Row>
                        <Col md="3" className="pr-0">
                          <ListGroup>
                            {!users.length ? <ListGroupItem>No users connected yet</ListGroupItem> : null}
                            {users.map((user, index) => <ListGroupItem
                                tag="button"
                                key={index}
                                action={true}
                                active={user.name === currentChatUser}
                                onClick={() => setCurrentChatUser(user.name)}
                              >
                                {user.name}
                              </ListGroupItem>
                            )}
                          </ListGroup>
                        </Col>
                        <Col md="9" className="pl-0">
                          <ChatCard
                            authUser={authUser}
                            currentChatUser={currentChatUser}
                            messages={messages[currentChatUser] || []}
                            onMessageSubmit={handleMessageSubmit}
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
              </>
            : null
          }
        </Col>
      </Row>
    </Container>
  );
}
