-- SAMPLE DATA FOR TESTING!!!

-- ==================================================
-- 1. SOCIETY
-- ==================================================

INSERT INTO society (society_id, society_name, address)
VALUES (1, 'BLF Nature Valley Luxury Floors', 'Sector 35, Sohna, Haryana');
VALUES (2, 'BLF Subedar Floors', 'Sector 67, Sohna, Haryana');

-- ==================================================
-- 2. BROKERS
-- ==================================================

INSERT INTO brokers (broker_id, society_id, broker_name, phone, user_id)
VALUES
    (1, 1, 'Goldy',          '9811100001', 1),
    (2, 1, 'Rajesh Verma',   '9811100002', 1),
    (3, 1, 'Sunita Brokers', '9811100003', 1),
    (4, 1, 'Deepak Arora',   '9811100004', 1),
    (5, 1, 'Meena Estates',  '9811100005', 1);


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


-- ==================================================
-- 4. PLOTS 
-- ==================================================

INSERT INTO plots (plot_id, society_id, plot_code, area_sqyd, area_sqft, type)
VALUES
    (1,  1, 'C1',  167, 1503, 'A'),
    (2,  1, 'C2',  167, 1503, 'A'),
    (3,  1, 'C8',  167, 1503, 'A'),
    (4,  1, 'C15', 167, 1503, 'A'),
    (5,  1, 'C16', 167, 1503, 'A'),
    (6,  1, 'C17', 167, 1503, 'A'),
    (7,  1, 'C18', 167, 1503, 'A'),
    (8,  1, 'C19', 167, 1503, 'A'),
    (9,  1, 'C20', 167, 1503, 'A'),
    (10, 1, 'C21', 167, 1503, 'A'),
    (11, 1, 'C22', 167, 1503, 'A'),
    (12, 1, 'C23', 167, 1503, 'A'),
    (13, 1, 'C24', 167, 1503, 'A'),
    (14, 1, 'C25', 167, 1503, 'A'),
    (15, 1, 'C26', 167, 1503, 'A'),
    (16, 1, 'C27', 138, 1242, 'B'),
    (17, 1, 'C31', 135, 1215, 'B'),
    (18, 1, 'C37', 163, 1467, 'A'),
    (19, 1, 'C53', 121, 1089, 'C'),
    (20, 1, 'A17', 167, 1503, 'A'),
    (21, 1, 'B31', 167, 1503, 'A');


-- ==================================================
-- 5. FLOORS (4 floors per plot = 84 rows)
-- ==================================================

INSERT INTO floors (floor_id, plot_id, floor_no, status)
VALUES
-- C1 
(1, 1, 1, 'AVAILABLE'), 
(2, 1, 2, 'AVAILABLE'), 
(3, 1, 3, 'AVAILABLE'), 
(4, 1, 4, 'INVESTOR_UNIT'),
 
-- C2 
(5, 2, 1, 'AVAILABLE'),
(6, 2, 2, 'AVAILABLE'), 
(7, 2, 3, 'SOLD'), 
(8, 2, 4, 'SOLD'),
 
-- C8 
(9, 3, 1, 'AVAILABLE'), 
(10, 3, 2, 'AVAILABLE'),
(11, 3, 3, 'AVAILABLE'), 
(12, 3, 4, 'AVAILABLE'),
 
-- C15 
(13, 4, 1, 'AVAILABLE'),
(14, 4, 2, 'AVAILABLE'), 
(15, 4, 3, 'SOLD'),
(16, 4, 4, 'SOLD'),
 
-- C16 
(17, 5, 1, 'SOLD'), 
(18, 5, 2, 'SOLD'), 
(19, 5, 3, 'SOLD'), 
(20, 5, 4, 'HOLD'),
 
-- C17 
(21, 6, 1, 'AVAILABLE'), 
(22, 6, 2, 'AVAILABLE'), 
(23, 6, 3, 'SOLD'), 
(24, 6, 4, 'SOLD'),
 
-- C18 
(25, 7, 1, 'AVAILABLE'), 
(26, 7, 2, 'SOLD'), 
(27, 7, 3, 'SOLD'), 
(28, 7, 4, 'SOLD'),
 
-- C19 
(29, 8, 1, 'AVAILABLE'), 
(30, 8, 2, 'SOLD'), 
(31, 8, 3, 'SOLD'),
(32, 8, 4, 'AVAILABLE'),
 
-- C20 
(33, 9, 1, 'AVAILABLE'),
(34, 9, 2, 'AVAILABLE'), 
(35, 9, 3, 'AVAILABLE'), 
(36, 9, 4, 'AVAILABLE'),
 
-- C21 
(37, 10, 1, 'AVAILABLE'),
(38, 10, 2, 'SOLD'), 
(39, 10, 3, 'SOLD'), 
(40, 10, 4, 'SOLD'),
 
-- C22 
(41, 11, 1, 'AVAILABLE'), 
(42, 11, 2, 'SOLD'), 
(43, 11, 3, 'SOLD'),
(44, 11, 4, 'SOLD'),
 
-- C23 
(45, 12, 1, 'AVAILABLE'), 
(46, 12, 2, 'AVAILABLE'), 
(47, 12, 3, 'HOLD'),
(48, 12, 4, 'AVAILABLE'),
 
-- C24 
(49, 13, 1, 'INVESTOR_UNIT'), 
(50, 13, 2, 'INVESTOR_UNIT'), 
(51, 13, 3, 'SOLD'),
(52, 13, 4, 'INVESTOR_UNIT'),
 
-- C25 
(53, 14, 1, 'AVAILABLE'), 
(54, 14, 2, 'SOLD'), 
(55, 14, 3, 'SOLD'), 
(56, 14, 4, 'AVAILABLE'),
 
-- C26 
(57, 15, 1, 'SOLD'), 
(58, 15, 2, 'SOLD'), 
(59, 15, 3, 'SOLD'), 
(60, 15, 4, 'AVAILABLE'),
 
-- C27 
(61, 16, 1, 'SOLD'), 
(62, 16, 2, 'INVESTOR_UNIT'), 
(63, 16, 3, 'AVAILABLE'), 
(64, 16, 4, 'SOLD'),
 
-- C31 
(65, 17, 1, 'AVAILABLE'), 
(66, 17, 2, 'AVAILABLE'), 
(67, 17, 3, 'SOLD'), 
(68, 17, 4, 'AVAILABLE'),
 
-- C37 
(69, 18, 1, 'AVAILABLE'), 
(70, 18, 2, 'AVAILABLE'), 
(71, 18, 3, 'AVAILABLE'), 
(72, 18, 4, 'AVAILABLE'),
 
-- C53 
(73, 19, 1, 'SOLD'),
(74, 19, 2, 'SOLD'),
(75, 19, 3, 'SOLD'), 
(76, 19, 4, 'SOLD'),
 
-- A17 
(77, 20, 1, 'AVAILABLE'),
(78, 20, 2, 'SOLD'),
(79, 20, 3, 'AVAILABLE'), 
(80, 20, 4, 'AVAILABLE'),
 
-- B31 
(81, 21, 1, 'AVAILABLE'), 
(82, 21, 2, 'AVAILABLE'), 
(83, 21, 3, 'SOLD'),
(84, 21, 4, 'SOLD');

-- ==================================================
-- 6. SALES
-- ==================================================

INSERT INTO sales (sale_id, floor_id, broker_id, customer_id, total_value, commission_percent, status)
VALUES
-- C2 
(1, 7, 2, 2, 7515000.00, 2.00, 'SOLD'),
(2, 8, 2, 2, 7515000.00, 2.00, 'SOLD'),
-- C15 
(3, 15, 3, 4, 7515000.00, 2.00, 'SOLD'),
(4, 16, 3, 4, 7515000.00, 2.00, 'SOLD'),
-- C16 
(5, 17, 2, 2, 7515000.00, 2.00, 'SOLD'),
(6, 18, 2, 2, 7515000.00, 2.00, 'SOLD'),  -- "Sold shifted from C15"
(7, 19, 2, 2, 7515000.00, 2.00, 'SOLD'),
(8, 20, 2, 2, 7515000.00, 2.00, 'HOLD'),  -- "Sold Token Done"
-- C17 
(9, 23, 3, 4, 7515000.00, 2.00, 'SOLD'),
(10, 24, 3, 4, 7515000.00, 2.00, 'SOLD'),
-- C18 
(11, 26, 4, 5, 7515000.00, 2.00, 'SOLD'),
(12, 27, 4, 5, 7515000.00, 2.00, 'SOLD'),
(13, 28, 4, 5, 7515000.00, 2.00, 'SOLD'),
-- C19 
(14, 30, 1, 1, 7515000.00, 2.00, 'SOLD'),  -- Sold (Goldy)
(15, 31, 1, 1, 7515000.00, 2.00, 'SOLD'),
-- C21 
(16, 38, 3, 4, 7515000.00, 2.00, 'SOLD'),
(17, 39, 3, 4, 7515000.00, 2.00, 'SOLD'),
(18, 40, 3, 4, 7515000.00, 2.00, 'SOLD'),
-- C22 
(19, 42, 4, 5, 7515000.00, 2.00, 'SOLD'),
(20, 43, 4, 5, 7515000.00, 2.00, 'SOLD'),
(21, 44, 4, 5, 7515000.00, 2.00, 'SOLD'),
-- C23 
(22, 47, 1, 1, 7515000.00, 2.00, 'HOLD'),
-- C24 
(23, 51, 2, 3, 7515000.00, 2.00, 'SOLD'),
-- C25 
(24, 54, 5, 5, 7515000.00, 2.00, 'SOLD'),
(25, 55, 5, 5, 7515000.00, 2.00, 'SOLD'),
-- C26 
(26, 57, 2, 2, 7515000.00, 2.00, 'SOLD'),
(27, 58, 2, 2, 7515000.00, 2.00, 'SOLD'),
(28, 59, 2, 2, 7515000.00, 2.00, 'SOLD'),
-- C27 
(29, 61, 3, 4, 6210000.00, 2.00, 'SOLD'),
(30, 64, 3, 4, 6210000.00, 2.00, 'SOLD'),
-- C31 
(31, 67, 4, 5, 6075000.00, 2.00, 'SOLD'),
-- C53 
(32, 73, 5, 2, 5445000.00, 2.00, 'SOLD'),
(33, 74, 5, 2, 5445000.00, 2.00, 'SOLD'),
(34, 75, 5, 2, 5445000.00, 2.00, 'SOLD'),
(35, 76, 5, 2, 5445000.00, 2.00, 'SOLD'),
-- A17 
(36, 78, 2, 4, 7515000.00, 2.00, 'SOLD'),
-- B31 
(37, 83, 3, 5, 7515000.00, 2.00, 'SOLD'),
(38, 84, 3, 5, 7515000.00, 2.00, 'SOLD');


-- ==================================================
-- 7. LINK active_sale_id on floors
-- ==================================================

UPDATE floors SET active_sale_id = 1  WHERE floor_id = 7;
UPDATE floors SET active_sale_id = 2  WHERE floor_id = 8;
UPDATE floors SET active_sale_id = 3  WHERE floor_id = 15;
UPDATE floors SET active_sale_id = 4  WHERE floor_id = 16;
UPDATE floors SET active_sale_id = 5  WHERE floor_id = 17;
UPDATE floors SET active_sale_id = 6  WHERE floor_id = 18;
UPDATE floors SET active_sale_id = 7  WHERE floor_id = 19;
UPDATE floors SET active_sale_id = 8  WHERE floor_id = 20;
UPDATE floors SET active_sale_id = 9  WHERE floor_id = 23;
UPDATE floors SET active_sale_id = 10 WHERE floor_id = 24;
UPDATE floors SET active_sale_id = 11 WHERE floor_id = 26;
UPDATE floors SET active_sale_id = 12 WHERE floor_id = 27;
UPDATE floors SET active_sale_id = 13 WHERE floor_id = 28;
UPDATE floors SET active_sale_id = 14 WHERE floor_id = 30;
UPDATE floors SET active_sale_id = 15 WHERE floor_id = 31;
UPDATE floors SET active_sale_id = 16 WHERE floor_id = 38;
UPDATE floors SET active_sale_id = 17 WHERE floor_id = 39;
UPDATE floors SET active_sale_id = 18 WHERE floor_id = 40;
UPDATE floors SET active_sale_id = 19 WHERE floor_id = 42;
UPDATE floors SET active_sale_id = 20 WHERE floor_id = 43;
UPDATE floors SET active_sale_id = 21 WHERE floor_id = 44;
UPDATE floors SET active_sale_id = 22 WHERE floor_id = 47;
UPDATE floors SET active_sale_id = 23 WHERE floor_id = 51;
UPDATE floors SET active_sale_id = 24 WHERE floor_id = 54;
UPDATE floors SET active_sale_id = 25 WHERE floor_id = 55;
UPDATE floors SET active_sale_id = 26 WHERE floor_id = 57;
UPDATE floors SET active_sale_id = 27 WHERE floor_id = 58;
UPDATE floors SET active_sale_id = 28 WHERE floor_id = 59;
UPDATE floors SET active_sale_id = 29 WHERE floor_id = 61;
UPDATE floors SET active_sale_id = 30 WHERE floor_id = 64;
UPDATE floors SET active_sale_id = 31 WHERE floor_id = 67;
UPDATE floors SET active_sale_id = 32 WHERE floor_id = 73;
UPDATE floors SET active_sale_id = 33 WHERE floor_id = 74;
UPDATE floors SET active_sale_id = 34 WHERE floor_id = 75;
UPDATE floors SET active_sale_id = 35 WHERE floor_id = 76;
UPDATE floors SET active_sale_id = 36 WHERE floor_id = 78;
UPDATE floors SET active_sale_id = 37 WHERE floor_id = 83;
UPDATE floors SET active_sale_id = 38 WHERE floor_id = 84;


-- ==================================================
-- 9. PAYMENTS (5 sample rows)
-- ==================================================

INSERT INTO payments (sale_id, milestone, amount, status, paid_at)
VALUES
    (1, 'TOKEN', 100000.00, 'DONE', '2024-01-10 10:00:00'),
    (1, 'ATS', 500000.00, 'DONE', '2024-02-01 11:00:00'),
    (5, 'TOKEN', 100000.00, 'DONE', '2024-03-05 09:30:00'),
    (22, 'TOKEN', 1000000.00, 'DONE', '2024-06-15 14:00:00'),  
    (8, 'TOKEN', 100000.00, 'DONE', '2024-07-01 10:00:00'); 


-- ==================================================
-- 10. FLOOR STATUS LOGS 
-- ==================================================

INSERT INTO floor_status_logs (floor_id, changed_by, old_status, new_status)
VALUES
    (7,  2, 'AVAILABLE', 'SOLD'),   -- C2  F3
    (15, 3, 'AVAILABLE', 'SOLD'),   -- C15 F3
    (17, 2, 'AVAILABLE', 'SOLD'),   -- C16 F1
    (18, 2, 'AVAILABLE', 'SOLD'),   -- C16 F2: shifted from C15
    (20, 2, 'AVAILABLE', 'HOLD');   -- C16 F4: token done

-- run this in pgAdmin query tool
SELECT setval('brokers_broker_id_seq', (SELECT MAX(broker_id) FROM brokers));
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('society_society_id_seq', (SELECT MAX(society_id) FROM society));
SELECT setval('plots_plot_id_seq', (SELECT MAX(plot_id) FROM plots));
SELECT setval('customers_customer_id_seq', (SELECT MAX(customer_id) FROM customers));
SELECT setval('sales_sale_id_seq', (SELECT MAX(sale_id) FROM sales));
SELECT setval('payments_payment_id_seq', (SELECT MAX(payment_id) FROM payments));
SELECT setval('floor_status_logs_log_id_seq', (SELECT MAX(log_id) FROM floor_status_logs));

