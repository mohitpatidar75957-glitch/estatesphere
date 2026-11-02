-- ========================================================
-- EstateSphere Residences - Supabase PostgreSQL Schema & Seed Data
-- ========================================================

-- 1. Create Properties / Apartments Table
CREATE TABLE IF NOT EXISTS properties (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    address VARCHAR(255),
    price NUMERIC(15, 2) NOT NULL,
    bedrooms INT,
    bathrooms INT,
    area_sqft INT,
    image_url VARCHAR(500),
    model_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    featured BOOLEAN DEFAULT FALSE,
    block VARCHAR(50),
    floor VARCHAR(50),
    typology VARCHAR(100),
    terrace_area INT,
    completion VARCHAR(100) DEFAULT 'Ready Q4 2026',
    apartment_number VARCHAR(50)
);

-- 2. Create Users / Admin Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'SALES_AGENT',
    name VARCHAR(150),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Inquiries / Leads Table
CREATE TABLE IF NOT EXISTS inquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    message TEXT,
    interested_apartment VARCHAR(255),
    assigned_agent VARCHAR(150) DEFAULT 'Unassigned',
    status VARCHAR(50) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed Default Admin Users
INSERT INTO users (username, email, password, role, name, phone)
VALUES
('superadmin', 'superadmin@estatesphere.com', '$2a$10$wN1rE1m1bZfG1/T.jN0L3.zZ1wzC/3P2Y/4R1kG0H8O0I0G0F0E0D', 'SUPER_ADMIN', 'Super Admin', '+91 98200 11000'),
('manager', 'manager@estatesphere.com', '$2a$10$wN1rE1m1bZfG1/T.jN0L3.zZ1wzC/3P2Y/4R1kG0H8O0I0G0F0E0D', 'ADMIN_MANAGER', 'Rohit Verma', '+91 98210 22111'),
('agent', 'agent@estatesphere.com', '$2a$10$wN1rE1m1bZfG1/T.jN0L3.zZ1wzC/3P2Y/4R1kG0H8O0I0G0F0E0D', 'SALES_AGENT', 'Pooja Sharma', '+91 98220 33222')
ON CONFLICT (email) DO NOTHING;

-- 5. Seed 25 EstateSphere Luxury Apartments (No-01 to No-25)
INSERT INTO properties (title, description, city, address, price, bedrooms, bathrooms, area_sqft, image_url, model_url, status, featured, block, floor, typology, terrace_area, completion, apartment_number)
SELECT
    CASE 
        WHEN i % 2 = 0 THEN '2 BHK Ready Luxury Home'
        WHEN i % 5 = 0 THEN '4 BHK Ready Luxury Home'
        ELSE '3 BHK ' || (CASE WHEN (i - 1) % 4 = 3 THEN 'Penthouse Duplex' WHEN (i - 1) % 4 = 0 THEN 'Garden Residence' ELSE 'Ready Luxury Home' END)
    END,
    'Elevated luxury residence featuring natural travertine stone finishes, open floorplan, Italian modular kitchen, and expansive private terrace.',
    'Costa del Sol',
    'Golden Mile, Marbella, Spain',
    25000000 + (i * 1250000),
    CASE WHEN i % 2 = 0 THEN 2 WHEN i % 5 = 0 THEN 4 ELSE 3 END,
    CASE WHEN (i % 2 = 0) THEN 2 ELSE 3 END,
    1250 + (i * 85),
    CASE 
        WHEN i % 4 = 0 THEN '/assets/estate-private-terrace.png'
        WHEN i % 3 = 0 THEN '/assets/estate-apartment-exterior.png'
        WHEN i % 2 = 0 THEN '/assets/estate-boutique-lounge.png'
        ELSE '/assets/luxury_villa_day.jpg'
    END,
    CASE WHEN i % 2 = 0 THEN '/assets/cayley-interior-8k.jpg' ELSE '/assets/kiara-interior-8k.jpg' END,
    CASE 
        WHEN i IN (3, 7, 14, 21) THEN 'RESERVED'
        WHEN i IN (5, 8, 19) THEN 'SOLD'
        ELSE 'AVAILABLE'
    END,
    (i % 5 = 0),
    'Block B' || (1 + ((i - 1) % 3)),
    CASE (i - 1) % 4 WHEN 0 THEN 'Ground Floor' WHEN 1 THEN '1st Floor' WHEN 2 THEN '2nd Floor' ELSE '3rd Floor' END,
    CASE (i - 1) % 4 WHEN 3 THEN 'Penthouse Duplex' WHEN 0 THEN 'Garden Residence' ELSE 'Ready Luxury Home' END,
    20 + (i * 3),
    'Ready Q4 2026',
    'No-' || LPAD(i::text, 2, '0')
FROM generate_series(1, 25) AS i
ON CONFLICT DO NOTHING;

