import { useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { createSocketForUser, getThreadMessages } from './helpers';
import { AuthUserForm } from './components/AuthUserForm';
import { ActiveUsersList } from './components/ActiveUsersList';
import { ChatCard } from './components/ChatCard';

export function App() {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [authUserName, setAuthUserName] = useState(null);
  const [currentThreadData, setCurrentThreadData] = useState({
    userName: null,
    messages: [],
  });

  function handleAuthUserSubmit(inputUserName) {
    const newSocket = createSocketForUser(inputUserName);

    newSocket.on('chat/active-users', (data) => {
      const newActiveUsers = data.filter((userName) => userName !== inputUserName);

      if (!newActiveUsers.length) {
        setCurrentThreadData({
          userName: null,
          messages: [],
        });
      }

      setActiveUsers(newActiveUsers);
    });

    newSocket.on('chat/received-message', ({userName, text}) => {
      setCurrentThreadData((oldData) => {
        if (oldData.userName === userName) {
          return {
            userName: oldData.userName,
            messages: [...oldData.messages, {userName, text}],
          };
        }

        return oldData;
      });
    });

    setSocket(newSocket);
    setAuthUserName(inputUserName);
  }

  async function handleThreadSelection(userName) {
    const messages = await getThreadMessages(userName, authUserName);

    setCurrentThreadData({
      userName,
      messages: messages.map((message) => ({
        userName: message.fromUser,
        text: message.text,
      })),
    });
  }

  function handleMessageSubmit(messageText) {
    setCurrentThreadData((oldData) => ({
      userName: oldData.userName,
      messages: [
        ...oldData.messages,
        {userName: authUserName, text: messageText},
      ],
    }));

    socket.emit('chat/send-message', {
      toUser: currentThreadData.userName,
      text: messageText,
    });
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
                    <Row className="content-wrapper">
                      <Col md="3" className="pr-0 h-100">
                        <ActiveUsersList
                          users={activeUsers}
                          threadUserName={currentThreadData.userName}
                          onItemClick={handleThreadSelection}
                        />
                      </Col>
                      <Col md="9" className="pl-0 h-100">
                        <ChatCard
                          authUserName={authUserName}
                          threadUserName={currentThreadData.userName}
                          threadMessages={currentThreadData.messages}
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
