// Local storage-based contact message operations
class ContactMessageStore {
  constructor() {
    this.storageKey = 'art_hub_contact_messages';
  }

  // Add a new contact message
  addMessage(messageData) {
    const messages = this.getAllMessages();
    const newMessage = {
      id: Date.now().toString(),
      ...messageData,
      created_at: new Date().toISOString()
    };
    
    messages.push(newMessage);
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
    return newMessage;
  }

  // Get all contact messages
  getAllMessages() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Delete a contact message
  deleteMessage(id) {
    const messages = this.getAllMessages();
    const filteredMessages = messages.filter(msg => msg.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredMessages));
  }

  // Mark message as read
  markAsRead(id) {
    const messages = this.getAllMessages();
    const message = messages.find(msg => msg.id === id);
    if (message) {
      message.read = true;
      message.updated_at = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(messages));
    }
  }
}

// Export a singleton instance
const contactMessageStore = new ContactMessageStore();
export default contactMessageStore;
