// orderStore.js
class OrderStore {
  constructor() {
    this.orderKey = 'campus-art-hub-orders';
    this.orders = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.orderKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.orderKey, JSON.stringify(this.orders));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  }

  getAllOrders() {
    return this.orders;
  }

  addOrder(order) {
    this.orders.push(order);
    this.saveToStorage();
  }

  clearOrders() {
    this.orders = [];
    this.saveToStorage();
  }
}

export const orderStore = new OrderStore(); 