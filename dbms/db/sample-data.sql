-- SAMPLE DATA FOR TESTING!!!

-- ==================================================
-- 1. SOCIETY & ADMIN USER
-- ==================================================

INSERT INTO society (society_id, society_name, address)
VALUES 
    (1, 'BLF Nature Valley Luxury Floors', 'Sector 35, Sohna, Haryana'),
    (2, 'BLF Subedar Floors', 'Sector 67, Sohna, Haryana');

INSERT INTO users (user_id, society_id, full_name, email, hashed_password, role, is_active)
VALUES (
    1, 
    1, 
    'Admin',
    'admin@blf.com',
    '$2b$12$ytRFOrhRkVH2t2Qye1g.m.jH1diVJTqFbq2OWGfzEzPrdcCz6doZC',
    'admin',
    true
);

-- ==================================================
-- 2. BROKERS
-- ==================================================

INSERT INTO brokers (broker_id, society_id, broker_name, phone, email, address, kyc_status, user_id)
VALUES
    (1, 1, 'Goldy',         '9811100001', 'goldy@broker.com',          '12, MG Road, Delhi',            'PENDING',  1),
    (2, 1, 'Rajesh Verma',  '9811100002', 'rajesh.verma@broker.com',   '45, Lajpat Nagar, Delhi',       'DONE',     1),
    (3, 1, 'Sunita Brokers','9811100003', 'sunita.brokers@broker.com', '78, Sector 14, Gurgaon',        'PENDING',  1),
    (4, 1, 'Deepak Arora',  '9811100004', 'deepak.arora@broker.com',   '23, Rohini Sector 7, Delhi',    'DONE',     1),
    (5, 1, 'Meena Estates', '9811100005', 'meena.estates@broker.com',  '56, Vasant Kunj, New Delhi',    'PENDING',  1);

-- ==================================================
-- 3. CUSTOMERS
-- ==================================================

INSERT INTO customers (customer_id, society_id, full_name, pan, phone, email, address, kyc_status)
VALUES
    (1, 1, 'Goldy Investments Pvt Ltd', 'AAACG1234A', '9900000001', 'goldy@email.com',    'Gurugram, Haryana',  'DONE'),
    (2, 1, 'Ramesh Gupta',              'BBBPG5678B', '9900000002', 'ramesh@email.com',   'Faridabad, Haryana', 'DONE'),
    (3, 1, 'Investor Unit Holder',      'CCCPI9012C', '9900000003', 'investor@email.com', 'Sohna, Haryana',     'DONE'),
    (4, 1, 'Priya Malhotra',            'DDDPM3456D', '9900000004', 'priya@email.com',    'Delhi',              'DONE'),
    (5, 1, 'Suresh Bhatt',              'EEESB7890E', '9900000005', 'suresh@email.com',   'Noida, UP',          'DONE');

INSERT INTO coapplicant (coapplicant_id, customer_id, full_name, pan, phone, email, address, kyc_status)
VALUES
    (1, 1, 'Anita Sharma',        'FFFAS2345F', '9900000011', 'anita.sharma@email.com',    'Gurugram, Haryana',  'DONE'),
    (2, 1, 'Vikram Mehta',        'GGGVM6789G', '9900000012', 'vikram.mehta@email.com',    'Gurugram, Haryana',  'DONE'),
    (3, 2, 'Sunita Gupta',        'HHHSG1023H', '9900000013', 'sunita.gupta@email.com',    'Faridabad, Haryana', 'DONE'),
    (4, 3, 'Rahul Verma',         'IIIRV4567I', '9900000014', 'rahul.verma@email.com',     'Sohna, Haryana',     'DONE'),
    (5, 4, 'Amit Malhotra',       'JJJAM8901J', '9900000015', 'amit.malhotra@email.com',   'Delhi',              'DONE'),
    (6, 4, 'Neha Kapoor',         'KKKNK2345K', '9900000016', 'neha.kapoor@email.com',     'Delhi',              'DONE'),
    (7, 5, 'Kavita Bhatt',        'LLLKB6789L', '9900000017', 'kavita.bhatt@email.com',    'Noida, UP',          'DONE');

-- ==================================================
-- 4. PLOTS
-- ==================================================

INSERT INTO plots (plot_id, society_id, plot_code, area_sqyd, area_sqft, type)
VALUES
    (1,  1, 'C1',  167, 1503, 'A'), (2,  1, 'C2',  167, 1503, 'A'), (3,  1, 'C8',  167, 1503, 'A'),
    (4,  1, 'C15', 167, 1503, 'A'), (5,  1, 'C16', 167, 1503, 'A'), (6,  1, 'C17', 167, 1503, 'A'),
    (7,  1, 'C18', 167, 1503, 'A'), (8,  1, 'C19', 167, 1503, 'A'), (9,  1, 'C20', 167, 1503, 'A'),
    (10, 1, 'C21', 167, 1503, 'A'), (11, 1, 'C22', 167, 1503, 'A'), (12, 1, 'C23', 167, 1503, 'A'),
    (13, 1, 'C24', 167, 1503, 'A'), (14, 1, 'C25', 167, 1503, 'A'), (15, 1, 'C26', 167, 1503, 'A'),
    (16, 1, 'C27', 138, 1242, 'B'), (17, 1, 'C31', 135, 1215, 'B'), (18, 1, 'C37', 163, 1467, 'A'),
    (19, 1, 'C53', 121, 1089, 'C'), (20, 1, 'A17', 167, 1503, 'A'), (21, 1, 'B31', 167, 1503, 'A');

-- ==================================================
-- 5. FLOORS (Including floor_value)
-- ==================================================

INSERT INTO floors (floor_id, plot_id, floor_no, floor_value, status)
VALUES
-- C1 to C26 standard pricing (7,515,000)
(1, 1, 1, 7515000, 'AVAILABLE'), (2, 1, 2, 7515000, 'AVAILABLE'), (3, 1, 3, 7515000, 'AVAILABLE'), (4, 1, 4, 7515000, 'INVESTOR_UNIT'),
(5, 2, 1, 7515000, 'AVAILABLE'), (6, 2, 2, 7515000, 'AVAILABLE'), (7, 2, 3, 7515000, 'SOLD'), (8, 2, 4, 7515000, 'SOLD'),
(9, 3, 1, 7515000, 'AVAILABLE'), (10, 3, 2, 7515000, 'AVAILABLE'), (11, 3, 3, 7515000, 'AVAILABLE'), (12, 3, 4, 7515000, 'AVAILABLE'),
(13, 4, 1, 7515000, 'AVAILABLE'), (14, 4, 2, 7515000, 'AVAILABLE'), (15, 4, 3, 7515000, 'SOLD'), (16, 4, 4, 7515000, 'SOLD'),
(17, 5, 1, 7515000, 'SOLD'), (18, 5, 2, 7515000, 'SOLD'), (19, 5, 3, 7515000, 'SOLD'), (20, 5, 4, 7515000, 'HOLD'),
(21, 6, 1, 7515000, 'AVAILABLE'), (22, 6, 2, 7515000, 'AVAILABLE'), (23, 6, 3, 7515000, 'SOLD'), (24, 6, 4, 7515000, 'SOLD'),
(25, 7, 1, 7515000, 'AVAILABLE'), (26, 7, 2, 7515000, 'SOLD'), (27, 7, 3, 7515000, 'SOLD'), (28, 7, 4, 7515000, 'SOLD'),
(29, 8, 1, 7515000, 'AVAILABLE'), (30, 8, 2, 7515000, 'SOLD'), (31, 8, 3, 7515000, 'SOLD'), (32, 8, 4, 7515000, 'AVAILABLE'),
(33, 9, 1, 7515000, 'AVAILABLE'), (34, 9, 2, 7515000, 'AVAILABLE'), (35, 9, 3, 7515000, 'AVAILABLE'), (36, 9, 4, 7515000, 'AVAILABLE'),
(37, 10, 1, 7515000, 'AVAILABLE'), (38, 10, 2, 7515000, 'SOLD'), (39, 10, 3, 7515000, 'SOLD'), (40, 10, 4, 7515000, 'SOLD'),
(41, 11, 1, 7515000, 'AVAILABLE'), (42, 11, 2, 7515000, 'SOLD'), (43, 11, 3, 7515000, 'SOLD'), (44, 11, 4, 7515000, 'SOLD'),
(45, 12, 1, 7515000, 'AVAILABLE'), (46, 12, 2, 7515000, 'AVAILABLE'), (47, 12, 3, 7515000, 'HOLD'), (48, 12, 4, 7515000, 'AVAILABLE'),
(49, 13, 1, 7515000, 'INVESTOR_UNIT'), (50, 13, 2, 7515000, 'INVESTOR_UNIT'), (51, 13, 3, 7515000, 'SOLD'), (52, 13, 4, 7515000, 'INVESTOR_UNIT'),
(53, 14, 1, 7515000, 'AVAILABLE'), (54, 14, 2, 7515000, 'SOLD'), (55, 14, 3, 7515000, 'SOLD'), (56, 14, 4, 7515000, 'AVAILABLE'),
(57, 15, 1, 7515000, 'SOLD'), (58, 15, 2, 7515000, 'SOLD'), (59, 15, 3, 7515000, 'SOLD'), (60, 15, 4, 7515000, 'AVAILABLE'),
-- C27 specialized pricing (6,210,000)
(61, 16, 1, 6210000, 'SOLD'), (62, 16, 2, 6210000, 'INVESTOR_UNIT'), (63, 16, 3, 6210000, 'AVAILABLE'), (64, 16, 4, 6210000, 'SOLD'),
-- C31 specialized pricing (6,075,000)
(65, 17, 1, 6075000, 'AVAILABLE'), (66, 17, 2, 6075000, 'AVAILABLE'), (67, 17, 3, 6075000, 'SOLD'), (68, 17, 4, 6075000, 'AVAILABLE'),
-- C37 standard pricing
(69, 18, 1, 7515000, 'AVAILABLE'), (70, 18, 2, 7515000, 'AVAILABLE'), (71, 18, 3, 7515000, 'AVAILABLE'), (72, 18, 4, 7515000, 'AVAILABLE'),
-- C53 specialized pricing (5,445,000)
(73, 19, 1, 5445000, 'SOLD'), (74, 19, 2, 5445000, 'SOLD'), (75, 19, 3, 5445000, 'SOLD'), (76, 19, 4, 5445000, 'SOLD'),
-- A17 / B31
(77, 20, 1, 7515000, 'AVAILABLE'), (78, 20, 2, 7515000, 'SOLD'), (79, 20, 3, 7515000, 'AVAILABLE'), (80, 20, 4, 7515000, 'AVAILABLE'),
(81, 21, 1, 7515000, 'AVAILABLE'), (82, 21, 2, 7515000, 'AVAILABLE'), (83, 21, 3, 7515000, 'SOLD'), (84, 21, 4, 7515000, 'SOLD');

-- ==================================================
-- 6. SALES
-- ==================================================

INSERT INTO sales (sale_id, floor_id, broker_id, customer_id, total_value, commission_amount, status)
VALUES
(1, 7, 2, 2, 7515000.00, 150300.00, 'SOLD'), (2, 8, 2, 2, 7515000.00, 150300.00, 'SOLD'),
(3, 15, 3, 4, 7515000.00, 150300.00, 'SOLD'), (4, 16, 3, 4, 7515000.00, 150300.00, 'SOLD'),
(5, 17, 2, 2, 7515000.00, 150300.00, 'SOLD'), (6, 18, 2, 2, 7515000.00, 150300.00, 'SOLD'),
(7, 19, 2, 2, 7515000.00, 150300.00, 'SOLD'), (8, 20, 2, 2, 7515000.00, 150300.00, 'HOLD'),
(9, 23, 3, 4, 7515000.00, 150300.00, 'SOLD'), (10, 24, 3, 4, 7515000.00, 150300.00, 'SOLD'),
(11, 26, 4, 5, 7515000.00, 150300.00, 'SOLD'), (12, 27, 4, 5, 7515000.00, 150300.00, 'SOLD'),
(13, 28, 4, 5, 7515000.00, 150300.00, 'SOLD'), (14, 30, 1, 1, 7515000.00, 150300.00, 'SOLD'),
(15, 31, 1, 1, 7515000.00, 150300.00, 'SOLD'), (16, 38, 3, 4, 7515000.00, 150300.00, 'SOLD'),
(17, 39, 3, 4, 7515000.00, 150300.00, 'SOLD'), (18, 40, 3, 4, 7515000.00, 150300.00, 'SOLD'),
(19, 42, 4, 5, 7515000.00, 150300.00, 'SOLD'), (20, 43, 4, 5, 7515000.00, 150300.00, 'SOLD'),
(21, 44, 4, 5, 7515000.00, 150300.00, 'SOLD'), (22, 47, 1, 1, 7515000.00, 150300.00, 'HOLD'),
(23, 51, 2, 3, 7515000.00, 150300.00, 'SOLD'), (24, 54, 5, 5, 7515000.00, 150300.00, 'SOLD'),
(25, 55, 5, 5, 7515000.00, 150300.00, 'SOLD'), (26, 57, 2, 2, 7515000.00, 150300.00, 'SOLD'),
(27, 58, 2, 2, 7515000.00, 150300.00, 'SOLD'), (28, 59, 2, 2, 7515000.00, 150300.00, 'SOLD'),
(29, 61, 3, 4, 6210000.00, 124200.00, 'SOLD'), (30, 64, 3, 4, 6210000.00, 124200.00, 'SOLD'),
(31, 67, 4, 5, 6075000.00, 121500.00, 'SOLD'), (32, 73, 5, 2, 5445000.00, 108900.00, 'SOLD'),
(33, 74, 5, 2, 5445000.00, 108900.00, 'SOLD'), (34, 75, 5, 2, 5445000.00, 108900.00, 'SOLD'),
(35, 76, 5, 2, 5445000.00, 108900.00, 'SOLD'), (36, 78, 2, 4, 7515000.00, 150300.00, 'SOLD'),
(37, 83, 3, 5, 7515000.00, 150300.00, 'SOLD'), (38, 84, 3, 5, 7515000.00, 150300.00, 'SOLD');

-- ==================================================
-- 7. LINK active_sale_id BACK ON FLOORS
-- ==================================================

UPDATE floors SET active_sale_id = sale_id FROM sales WHERE floors.floor_id = sales.floor_id;

-- ==================================================
-- 8. PAYMENTS
-- ==================================================

INSERT INTO payments (sale_id, milestone, mratio, total_amount, paid_amount, status, paid_at, due_date)
VALUES
(1, 'TOKEN',           '30:10:60', 2254500.00, 2254500.00, 'DONE',    '2024-01-10 10:00:00', '2024-01-10 00:00:00'),
(1, 'SUPERSTRUCTURE',  '30:10:60', 751500.00,  751500.00,  'DONE',    '2024-05-20 11:00:00', '2024-05-15 00:00:00'),
(1, 'REGISTRY',        '30:10:60', 4509000.00, 4509000.00, 'DONE',    '2024-10-05 09:00:00', '2024-10-01 00:00:00'),
(5, 'TOKEN',           '30:70',    2254500.00, 2254500.00, 'DONE',    '2024-03-05 09:30:00', '2024-03-05 00:00:00'),
(5, 'REGISTRY',        '30:70',    5260500.00,       0.00, 'PENDING',  NULL,                 '2024-11-01 00:00:00'),
(22, 'TOKEN',          '40:60',    3006000.00, 1000000.00, 'PENDING', '2024-06-15 14:00:00', '2024-06-20 00:00:00'),
(22, 'REGISTRY',       '40:60',    4509000.00,       0.00, 'PENDING',  NULL,                 '2025-01-01 00:00:00'),
(29, 'TOKEN',          '30:10:60', 1863000.00, 1863000.00, 'DONE',    '2024-04-10 10:00:00', '2024-04-10 00:00:00'),
(29, 'SUPERSTRUCTURE', '30:10:60', 621000.00,  310500.00,  'PENDING', '2024-08-01 11:00:00', '2024-07-15 00:00:00'),
(29, 'REGISTRY',       '30:10:60', 3726000.00,       0.00, 'PENDING',  NULL,                 '2024-12-15 00:00:00'),
(32, 'TOKEN',          '40:60',    2178000.00, 2178000.00, 'DONE',    '2024-07-01 10:00:00', '2024-07-01 00:00:00'),
(32, 'REGISTRY',       '40:60',    3267000.00, 1500000.00, 'PENDING', '2024-09-15 10:00:00', '2024-09-01 00:00:00');

-- ==================================================
-- 9. LOGS
-- ==================================================

INSERT INTO floor_status_logs (floor_id, changed_by, old_status, new_status)
VALUES
    (7,  1, 'AVAILABLE', 'SOLD'),
    (15, 1, 'AVAILABLE', 'SOLD'),
    (17, 1, 'AVAILABLE', 'SOLD'),
    (18, 1, 'AVAILABLE', 'SOLD'),
    (20, 1, 'AVAILABLE', 'HOLD');

-- ==================================================
-- 10. SEQUENCE RESET
-- ==================================================

SELECT setval('society_society_id_seq', (SELECT MAX(society_id) FROM society));
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('brokers_broker_id_seq', (SELECT MAX(broker_id) FROM brokers));
SELECT setval('customers_customer_id_seq', (SELECT MAX(customer_id) FROM customers));
SELECT setval('plots_plot_id_seq', (SELECT MAX(plot_id) FROM plots));
SELECT setval('floors_floor_id_seq', (SELECT MAX(floor_id) FROM floors));
SELECT setval('sales_sale_id_seq', (SELECT MAX(sale_id) FROM sales));
SELECT setval('payments_payment_id_seq', (SELECT MAX(payment_id) FROM payments));
SELECT setval('floor_status_logs_log_id_seq', (SELECT MAX(log_id) FROM floor_status_logs));
