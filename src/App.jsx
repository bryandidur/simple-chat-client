import { useState} from 'react';
import io from 'socket.io-client';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { AuthUserForm } from './components/AuthUserForm';
import { ActiveUsersList } from './components/ActiveUsersList';
import { ChatCard } from './components/ChatCard';

function createSocketForUser(userName) {
  const socket = io(`http://localhost:8000?userName=${userName}`);

  socket.on('connect', () => console.log('WebSocket connected!'));
  socket.on('disconnect', () => console.log('WebSocket disconnected!'));

  return socket;
}

export function App() {
  const [socket, setSocket] = useState();
  const [threads, setThreads] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [authUserName, setAuthUserName] = useState(null);
  const [currentThreadUserName, setCurrentThreadUserName] = useState(null);

  function appendMessageToThread(threadUserName, {userName, text}) {
    setThreads((oldMessages) => {
      const oldThreadMessages = oldMessages[threadUserName];
      const newThreadMessages = [...(oldThreadMessages || []), {userName, text}];

      return {
        ...oldMessages,
        [threadUserName]: newThreadMessages,
      };
    });
  }

  function handleAuthUserSubmit(inputUserName) {
    const newSocket = createSocketForUser(inputUserName);

    newSocket.on('chat/active-users', (data) => {
      setActiveUsers(() => {
        const newActiveUsers = data.filter((userName) => userName !== inputUserName);

        if (!newActiveUsers.length) {
          setCurrentThreadUserName(null);
        }

        return newActiveUsers;
      });
    });

    newSocket.on('chat/received-message', ({userName, text}) => {
      appendMessageToThread(userName, {userName, text});
    });

    setSocket(newSocket);
    setAuthUserName(inputUserName);
  }

  function handleMessageSubmit(messageText) {
    appendMessageToThread(currentThreadUserName, {userName: authUserName, text: messageText});

    socket.emit('chat/send-message', {toUser: currentThreadUserName, text: messageText});
  }

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md="10">
          {!authUserName ? <AuthUserForm onSubmit={handleAuthUserSubmit} /> : null}

          {
            authUserName
            ? <>
                <h5>Welcome {authUserName}, start chatting now! ;)</h5>
                <Card>
                  <CardBody className="py-0 px-0">
                    <Row>
                      <Col md="3" className="pr-0">
                        <ActiveUsersList
                          users={activeUsers}
                          threadUserName={currentThreadUserName}
                          onItemClick={(userName) => setCurrentThreadUserName(userName)}
                        />
                      </Col>
                      <Col md="9" className="pl-0">
                        <ChatCard
                          authUserName={authUserName}
                          threadUserName={currentThreadUserName}
                          threadMessages={threads[currentThreadUserName] || []}
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
