-- ==================================================
-- ENUM TYPES
-- ==================================================

CREATE TYPE inventory_status AS ENUM (
    'AVAILABLE',
    'HOLD',
    'SOLD',
    'CANCELLED',
    'INVESTOR_UNIT'
);

CREATE TYPE sale_status AS ENUM (
    'HOLD',
    'SOLD',
    'CANCELLED',
    'INVESTOR_UNIT'
);

CREATE TYPE milestone_type AS ENUM (
    'TOKEN',
    'ATS',
    'SUPERSTRUCTURE',
    'PROPERTY_ID',
    'REGISTRY',
    'POSSESSION'
);

CREATE TYPE milestone_status AS ENUM (
    'PENDING',
    'DONE'
);

CREATE TYPE kyc_status AS ENUM (
    'PENDING',
    'DONE'
);

CREATE TYPE entity_type AS ENUM (
    'CUSTOMER',
    'SALE'
);

CREATE TYPE user_role AS ENUM ('admin', 'rm');

-- ==================================================
-- SOCIETY (Managed by ADMIN)
-- ==================================================

CREATE TABLE society (
    society_id SERIAL PRIMARY KEY,
    society_name VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- admin and user tables
-- ==================================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    society_id INT REFERENCES society(society_id),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'rm',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- BROKERS (Managed by RM)
-- ==================================================

CREATE TABLE brokers (
    broker_id SERIAL PRIMARY KEY,
    society_id INT NOT NULL REFERENCES society(society_id),
    broker_name VARCHAR(100),
    phone VARCHAR(20) UNIQUE,
    user_id INT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- PLOTS (WITH LENGTH & BREADTH)
-- ==================================================

CREATE TABLE plots (
    plot_id SERIAL PRIMARY KEY,
    society_id INT NOT NULL REFERENCES society(society_id),
    plot_code VARCHAR(20) UNIQUE NOT NULL,  -- C1, C2, C3
    area_sqyd NUMERIC(10,2),
    area_sqft NUMERIC(10,2),
    type CHAR(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- FLOORS (Floor Status Matrix Units)
-- ==================================================

CREATE TABLE floors (
    floor_id SERIAL PRIMARY KEY,
    plot_id INT NOT NULL REFERENCES plots(plot_id) ON DELETE CASCADE,
    floor_no INT,
    status inventory_status DEFAULT 'AVAILABLE',
    active_sale_id INT,
    UNIQUE(plot_id, floor_no)
);

-- ==================================================
-- FLOOR STATUS AUDIT LOG
-- ==================================================

CREATE TABLE floor_status_logs (
    log_id SERIAL PRIMARY KEY,
    floor_id INT NOT NULL REFERENCES floors(floor_id) ON DELETE CASCADE,
    changed_by INT NOT NULL REFERENCES users(user_id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_floor_logs_floor ON floor_status_logs(floor_id);

-- ==================================================
-- CUSTOMERS (KYC)
-- ==================================================

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    society_id INT NOT NULL REFERENCES society(society_id),
    full_name VARCHAR(100),
    pan VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    kyc_status kyc_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- SALES (Transaction Control)
-- ==================================================

CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    floor_id INT UNIQUE NOT NULL REFERENCES floors(floor_id),
    broker_id INT NOT NULL REFERENCES brokers(broker_id),
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    total_value NUMERIC(14,2) NOT NULL,
    commission_percent NUMERIC(5,2),
    status sale_status DEFAULT 'HOLD',
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link sale back to floor
ALTER TABLE floors
ADD CONSTRAINT fk_active_sale
FOREIGN KEY (active_sale_id)
REFERENCES sales(sale_id);

-- ==================================================
-- PAYMENTS (Milestone Boolean Tracking)
-- ==================================================

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    milestone milestone_type NOT NULL,
    amount NUMERIC(14,2),
    status milestone_status DEFAULT 'PENDING',
    paid_at TIMESTAMP,
    UNIQUE(sale_id, milestone)
);

-- ==================================================
-- DOCUMENTS (File Upload)
-- ==================================================

CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    entity entity_type DEFAULT 'CUSTOMER',
    sale_id INT NOT NULL REFERENCES sales(sale_id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_entity ON documents(entity, sale_id);

-- ==================================================
-- BROKER PERFORMANCE VIEW (From Meeting 2)
-- ==================================================

CREATE VIEW broker_performance AS
SELECT 
    b.broker_id,
    b.broker_name,
    COUNT(CASE WHEN s.status = 'SOLD' THEN 1 END) AS total_sold,
    COUNT(CASE WHEN s.status = 'CANCELLED' THEN 1 END) AS total_cancelled
FROM brokers b
LEFT JOIN sales s ON b.broker_id = s.broker_id
GROUP BY b.broker_id, b.broker_name;

-- ==================================================
-- FULL DATABASE VIEW
-- ==================================================

CREATE VIEW global_inventory_master AS
SELECT 
    p.society_id,
    p.plot_code,
    f.floor_no,
    f.status AS inventory_status,
    p.area_sqft,
    s.sale_id,
    s.total_value,
    s.status AS sale_status,
    c.full_name AS customer_name,
    c.phone AS customer_phone,
    b.broker_name,
    (SELECT COUNT(*) FROM payments pay WHERE pay.sale_id = s.sale_id AND pay.status = 'DONE') AS milestones_completed
FROM plots p
JOIN floors f ON p.plot_id = f.plot_id
LEFT JOIN sales s ON f.floor_id = s.floor_id
LEFT JOIN customers c ON s.customer_id = c.customer_id
LEFT JOIN brokers b ON s.broker_id = b.broker_id;

-- ==================================================
-- INDEXES
-- ==================================================

CREATE INDEX idx_floors_status ON floors(status);
CREATE INDEX idx_sales_broker ON sales(broker_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_payments_sale ON payments(sale_id);


-- ==================================================
-- DEFAULT ADMIN USER
-- ==================================================
INSERT INTO users (full_name, email, hashed_password, role, is_active)
VALUES (
    'Admin',
    'admin@blf.com',
    '$2b$12$ytRFOrhRkVH2t2Qye1g.m.jH1diVJTqFbq2OWGfzEzPrdcCz6doZC',
    'admin',
    true
);
