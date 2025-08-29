// Initialize default data for local storage
export function initializeDefaultData() {
  // Initialize admin user
  if (!localStorage.getItem('art_hub_users')) {
    const defaultUsers = [
      {
        id: 'admin-001',
        email: 'admin@campusarthub.com',
        password: 'admin123', // In production, this should be hashed
        name: 'Admin User',
        phone: '+1234567890',
        address: 'Campus Art Hub HQ',
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('art_hub_users', JSON.stringify(defaultUsers));
  }

  // Initialize image management data
  if (!localStorage.getItem('art_hub_image_management')) {
    const defaultImages = [
      {
        id: '1',
        type: 'carousel',
        image: 'Art.jpg',
        label: 'Featured Artwork',
        link: '/products',
        order_index: 0,
        section_text: 'Discover Amazing Art',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'carousel',
        image: 'Handmade.png',
        label: 'Handmade Collection',
        link: '/products',
        order_index: 1,
        section_text: 'Handcrafted Art',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        type: 'wall',
        image: 'Butterfly.jpg',
        label: 'Wall Art',
        link: '/products',
        order_index: 0,
        section_text: 'Design Your Wall with Our Products!',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        type: 'offer',
        image: 'Art.jpg',
        label: 'Special Offers',
        link: '/products',
        order_index: 0,
        section_text: 'Exclusive Offers',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('art_hub_image_management', JSON.stringify(defaultImages));
  }

  // Initialize contact messages storage
  if (!localStorage.getItem('art_hub_contact_messages')) {
    localStorage.setItem('art_hub_contact_messages', JSON.stringify([]));
  }

  console.log('✅ Default data initialized successfully!');
}

// Call this function when the app starts
export function setupLocalStorage() {
  initializeDefaultData();
}
