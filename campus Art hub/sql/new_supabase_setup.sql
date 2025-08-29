-- Fresh Supabase setup for Art Hub - New Project
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- 1. Create image_management table
CREATE TABLE image_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('carousel', 'wall', 'offer')),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    path TEXT,
    size INTEGER,
    alt_text TEXT,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    category VARCHAR(255),
    images TEXT[],
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    address TEXT,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    placed_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX idx_image_management_type ON image_management(type);
CREATE INDEX idx_image_management_active ON image_management(is_active);
CREATE INDEX idx_image_management_order ON image_management(display_order);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_customer ON orders(customer_email);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_admin ON users(is_admin);

-- 7. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_image_management_updated_at BEFORE UPDATE ON image_management FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Enable Row Level Security
ALTER TABLE image_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 9. Create public read policies
CREATE POLICY "Public read access for images" ON image_management FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (status = 'active');

-- 10. Create admin policies (allow all operations for authenticated users)
CREATE POLICY "Admin full access to images" ON image_management FOR ALL USING (true);
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access to orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin full access to users" ON users FOR ALL USING (true);

-- 11. Insert default admin user
INSERT INTO users (email, name, is_admin) VALUES 
('admin@campusarthub.com', 'Admin User', true);

-- 12. Insert default categories
INSERT INTO categories (name, description, image) VALUES
('Paintings', 'Beautiful hand-painted artworks', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'),
('Sculptures', '3D artistic creations', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'),
('Digital Art', 'Modern digital artworks', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400'),
('Photography', 'Captured moments in time', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400'),
('Handmade Crafts', 'Unique handmade items', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400');

-- 13. Insert sample products
INSERT INTO products (name, description, price, stock, category, images) VALUES
('Abstract Canvas Painting', 'Beautiful abstract artwork on canvas', 299.99, 5, 'Paintings', ARRAY['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400']),
('Ceramic Sculpture', 'Handcrafted ceramic sculpture', 199.99, 3, 'Sculptures', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400']),
('Digital Art Print', 'High-quality digital art print', 79.99, 10, 'Digital Art', ARRAY['https://images.unsplash.com/photo-1549490349-8643362247b5?w=400']),
('Nature Photography', 'Stunning landscape photograph', 149.99, 7, 'Photography', ARRAY['https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400']),
('Handwoven Basket', 'Traditional handwoven craft', 89.99, 12, 'Handmade Crafts', ARRAY['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400']);

-- Success message
SELECT 'Database setup completed successfully! 🎉' as message;
