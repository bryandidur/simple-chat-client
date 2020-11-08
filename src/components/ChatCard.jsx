import { useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { ChatMessages } from './ChatMessages';
import { ChatMessageForm } from './ChatMessageForm';
import { scrollToBottom } from '../helpers';

export function ChatCard(props) {
  const {authUserName, threadUserName, threadMessages, onMessageSubmit} = props;

  useEffect(() => {
    scrollToBottom('chat-card-body');
  }, [threadMessages]);

  return (
    <Card className="h-100">
      <CardHeader>{threadUserName}</CardHeader>

      <CardBody className="chat-card-body">
        <ChatMessages authUserName={authUserName} threadMessages={threadMessages} />
      </CardBody>

      <CardFooter>
        <ChatMessageForm disabled={!threadUserName} onSubmit={onMessageSubmit} />
      </CardFooter>
    </Card>
  );
}
