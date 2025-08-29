// Local storage-based user operations
export async function getAllUsers() {
  const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
  return users;
}

export async function updateUser(id, updates) {
  const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
  const index = users.findIndex(user => user.id === id);
  if (index === -1) throw new Error('User not found');
  
  users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem('art_hub_users', JSON.stringify(users));
  
  // Update current user if it's the same user
  const currentUser = JSON.parse(localStorage.getItem('art_hub_current_user'));
  if (currentUser && currentUser.id === id) {
    localStorage.setItem('art_hub_current_user', JSON.stringify(users[index]));
  }
  
  return users[index];
}

export async function deleteUser(id) {
  const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
  const filteredUsers = users.filter(user => user.id !== id);
  localStorage.setItem('art_hub_users', JSON.stringify(filteredUsers));
  
  // Clear current user if it's the deleted user
  const currentUser = JSON.parse(localStorage.getItem('art_hub_current_user'));
  if (currentUser && currentUser.id === id) {
    localStorage.removeItem('art_hub_current_user');
  }
}