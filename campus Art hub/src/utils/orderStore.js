// Local storage-based order store
import { createOrder, updateOrder, getAllOrders } from './ordersApi';

class OrderStore {
  constructor() {
    this.orders = [];
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      this.orders = await getAllOrders();
      this.initialized = true;
    }
  }

  async addOrder(orderData) {
    const order = await createOrder(orderData);
    await this.initialize();
    this.orders.push(order);
    return order;
  }

  async updateOrder(orderId, updates) {
    const updatedOrder = await updateOrder(orderId, updates);
    await this.initialize();
    const index = this.orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
    return updatedOrder;
  }

  async getAllOrders() {
    await this.initialize();
    return this.orders;
  }

  async getOrderById(orderId) {
    await this.initialize();
    return this.orders.find(order => order.id === orderId);
  }

  async getUserOrders(userId) {
    await this.initialize();
    return this.orders.filter(order => order.user_id === userId || order.customer?.id === userId);
  }

  // Refresh orders from storage
  async refresh() {
    this.orders = await getAllOrders();
  }
}

// Export singleton instance
const orderStore = new OrderStore();
export { orderStore };
