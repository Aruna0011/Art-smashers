// Contact Message Store for managing contact form messages
class ContactMessageStore {
  constructor() {
    this.messagesKey = 'art_hub_contact_messages';
    this.messages = this.loadFromStorage();
  }

  // Load messages from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.messagesKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading contact messages from storage:', error);
      return [];
    }
  }

  // Save messages to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.messagesKey, JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving contact messages to storage:', error);
    }
  }

  // Add a new message
  addMessage(message) {
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date().toISOString()
    };
    
    this.messages.push(newMessage);
    this.saveToStorage();
    
    console.log('📧 Contact message saved:', newMessage);
    return newMessage;
  }

  // Get all messages
  getMessages() {
    return this.messages;
  }

  // Delete a message
  deleteMessage(messageId) {
    this.messages = this.messages.filter(msg => msg.id !== messageId);
    this.saveToStorage();
  }

  // Clear all messages
  clearMessages() {
    this.messages = [];
    this.saveToStorage();
  }

  // Get message count
  getMessageCount() {
    return this.messages.length;
  }
}

// Create singleton instance
const contactMessageStore = new ContactMessageStore();

export default contactMessageStore; 