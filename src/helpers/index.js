
export function scrollToBottom(elementClass) {
  const element = document.getElementsByClassName(elementClass)[0];

  if (element) {
    element.scrollTo(0, element.scrollHeight);
  }
}
