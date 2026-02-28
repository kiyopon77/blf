-- ==================================================
-- ENUM TYPES
-- ==================================================

CREATE TYPE inventory_status AS ENUM (
    'AVAILABLE',
    'HOLD',
    'SOLD',
    'CANCELLED'
);

CREATE TYPE sale_status AS ENUM (
    'HOLD',
    'SOLD',
    'CANCELLED'
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

CREATE TYPE user_role AS ENUM ('admin', 'user');

-- ==================================================
-- admin and user tables
-- ==================================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- RELATIONSHIP MANAGERS
-- ==================================================

CREATE TABLE relationship_managers (
    rm_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- BROKERS (Managed by RM)
-- ==================================================

CREATE TABLE brokers (
    broker_id SERIAL PRIMARY KEY,
    broker_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    rm_id INT NOT NULL REFERENCES relationship_managers(rm_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- PLOTS (WITH LENGTH & BREADTH)
-- ==================================================

CREATE TABLE plots (
    plot_id SERIAL PRIMARY KEY,
    plot_code VARCHAR(20) UNIQUE NOT NULL,  -- C1, C2, C3
    length NUMERIC(10,2) NOT NULL,
    breadth NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- FLOORS (Floor Status Matrix Units)
-- ==================================================

CREATE TABLE floors (
    floor_id SERIAL PRIMARY KEY,
    plot_id INT NOT NULL REFERENCES plots(plot_id) ON DELETE CASCADE,
    floor_no INT NOT NULL,
    status inventory_status DEFAULT 'AVAILABLE',
    active_sale_id INT,
    UNIQUE(plot_id, floor_no)
);

-- ==================================================
-- CUSTOMERS (KYC)
-- ==================================================

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    pan VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    kyc_status VARCHAR(20) DEFAULT 'PENDING',
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
-- INDEXES
-- ==================================================

CREATE INDEX idx_floors_status ON floors(status);
CREATE INDEX idx_sales_broker ON sales(broker_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_payments_sale ON payments(sale_id);
