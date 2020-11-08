import { useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Alert } from 'reactstrap';
import { ChatMessageForm } from './ChatMessageForm';
import { scrollToBottom } from '../helpers';

export function ChatCard(props) {
  const {authUser, currentChatUser, messages, onMessageSubmit} = props;

  useEffect(() => {
    scrollToBottom('chat-card-body');
  }, [messages]);

  return (
    <Card>
      <CardHeader>{currentChatUser}</CardHeader>

      <CardBody className="chat-card-body">
        {messages.map((message, index) => {
          const color = message.user === authUser ? 'success' : 'primary';
          const author = message.user === authUser ? 'You' : message.user;
          const position = message.user === authUser ? 'right' : 'left';

          return (
            <div className={`text-${position}`} key={index}>
              <Alert color={color} className="d-inline-block">
                <small className="d-block"><b>{author}</b></small>
                {message.message}
              </Alert>
            </div>
          );
        })}
      </CardBody>

      <CardFooter>
        <ChatMessageForm disabled={!currentChatUser} onSubmit={onMessageSubmit} />
      </CardFooter>
    </Card>
  );
}
