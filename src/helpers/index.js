import apisauce from 'apisauce';
import io from 'socket.io-client';

export function createSocketForUser(userName) {
  const socket = io(`${process.env.REACT_APP_API_URL}?authUserName=${userName}`);

  socket.on('connect', () => console.log('WebSocket connected!'));
  socket.on('disconnect', () => console.log('WebSocket disconnected!'));

  return socket;
}

export async function getThreadMessages(userName, authUserName) {
  const api = apisauce.create({baseURL: process.env.REACT_APP_API_URL});
  const response = await api.get(`/chat/messages/${userName}?authUserName=${authUserName}`);

  if (response.ok) {
    return response.data;
  }

  throw new Error('Failed to fetch thread messages!');
}

export function scrollToBottom(elementClass) {
  const element = document.getElementsByClassName(elementClass)[0];

  if (element) {
    element.scrollTo(0, element.scrollHeight);
  }
}
