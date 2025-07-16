// contactMessageStore.js
class ContactMessageStore {
  constructor() {
    this.key = 'art_hub_contact_messages';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  getAllMessages() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  addMessage({ name, email, message }) {
    const messages = this.getAllMessages();
    messages.push({
      name,
      email,
      message,
      date: new Date().toISOString(),
    });
    localStorage.setItem(this.key, JSON.stringify(messages));
  }

  clearMessages() {
    localStorage.setItem(this.key, JSON.stringify([]));
  }
}

const contactMessageStore = new ContactMessageStore();
export default contactMessageStore; 