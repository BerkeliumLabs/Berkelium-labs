export class ChatManager {
  init() {
    const chatSendBtn: HTMLButtonElement = document.querySelector('#chat-send-btn');
    chatSendBtn.addEventListener('click', this.generateResponse);
  }

  generateResponse() {
    window.berkelium
      .generateText()
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }
}
