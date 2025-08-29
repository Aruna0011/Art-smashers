// Local storage-based orders operations
export async function getAllOrders() {
  const orders = JSON.parse(localStorage.getItem('art_hub_orders') || '[]');
  return orders;
}

export async function updateOrder(id, updates) {
  const orders = JSON.parse(localStorage.getItem('art_hub_orders') || '[]');
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) throw new Error('Order not found');
  
  orders[index] = { ...orders[index], ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem('art_hub_orders', JSON.stringify(orders));
  return orders[index];
}

export async function createOrder(orderData) {
  const orders = JSON.parse(localStorage.getItem('art_hub_orders') || '[]');
  const newOrder = {
    ...orderData,
    id: Date.now().toString(),
    placed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  orders.push(newOrder);
  localStorage.setItem('art_hub_orders', JSON.stringify(orders));
  return newOrder;
}