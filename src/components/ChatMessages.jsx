import { Alert } from 'reactstrap';

export function ChatMessages(props) {
  const {authUserName, threadMessages} = props;

  const messages = threadMessages.map((message, index) => {
    const color = message.userName === authUserName ? 'success' : 'primary';
    const author = message.userName === authUserName ? 'You' : message.userName;
    const position = message.userName === authUserName ? 'right' : 'left';

    return (
      <div className={`text-${position}`} key={index}>
        <Alert color={color} className="d-inline-block">
          <small className="d-block"><b>{author}</b></small>
          {message.text}
        </Alert>
      </div>
    );
  });

  return (messages);
}
