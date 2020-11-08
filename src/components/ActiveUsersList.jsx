import { ListGroup, ListGroupItem } from 'reactstrap';

export function ActiveUsersList(props) {
  const {users, threadUserName, onItemClick} = props;

  const listItems = users.map((userName, index) => <ListGroupItem
      tag="button"
      key={index}
      action={true}
      active={userName === threadUserName}
      onClick={() => onItemClick(userName)}
    >
      {userName}
    </ListGroupItem>
  );

  return (
    <ListGroup>
      {!listItems.length ? <ListGroupItem>No users connected yet</ListGroupItem> : null}
      {listItems}
    </ListGroup>
  );
}
