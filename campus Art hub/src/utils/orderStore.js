// Order Store for managing order state
class OrderStore {
  constructor() {
    this.orderKey = 'campus-art-hub-order';
    this.currentOrder = this.loadFromStorage();
  }

  // Load order from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.orderKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading order from storage:', error);
      return null;
    }
  }

  // Save order to localStorage
  saveToStorage() {
    try {
      if (this.currentOrder) {
        localStorage.setItem(this.orderKey, JSON.stringify(this.currentOrder));
      } else {
        localStorage.removeItem(this.orderKey);
      }
    } catch (error) {
      console.error('Error saving order to storage:', error);
    }
  }

  // Set current order
  setOrder(order) {
    this.currentOrder = order;
    this.saveToStorage();
  }

  // Get current order
  getOrder() {
    return this.currentOrder;
  }

  // Clear current order
  clearOrder() {
    this.currentOrder = null;
    this.saveToStorage();
  }

  // Update order status
  updateOrderStatus(status) {
    if (this.currentOrder) {
      this.currentOrder.status = status;
      this.saveToStorage();
    }
  }

  // Add payment information
  addPaymentInfo(paymentInfo) {
    if (this.currentOrder) {
      this.currentOrder.paymentInfo = paymentInfo;
      this.saveToStorage();
    }
  }

  // Add shipping information
  addShippingInfo(shippingInfo) {
    if (this.currentOrder) {
      this.currentOrder.shippingInfo = shippingInfo;
      this.saveToStorage();
    }
  }
}

// Create singleton instance
export const orderStore = new OrderStore(); 