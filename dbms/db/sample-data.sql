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
    (1, 1, 'Goldy',          '9811100001', 2),
    (2, 1, 'Rajesh Verma',   '9811100002', 2),
    (3, 1, 'Sunita Brokers', '9811100003', 3),
    (4, 1, 'Deepak Arora',   '9811100004', 4),
    (5, 1, 'Meena Estates',  '9811100005', 5);


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
(11,  1, 1, 'AVAILABLE'), 
(12,  1, 2, 'AVAILABLE'), 
(13,  1, 3, 'AVAILABLE'),
(14,  1, 4, 'INVESTOR_UNIT'),

-- C2
(21,  2, 1, 'AVAILABLE'), 
(22,  2, 2, 'AVAILABLE'), 
(23,  2, 3, 'SOLD'), 
(24,  2, 4, 'SOLD'),

-- C8
(31,  3, 1, 'AVAILABLE'), 
(32,  3, 2, 'AVAILABLE'), 
(33,  3, 3, 'AVAILABLE'), 
(34,  3, 4, 'AVAILABLE'),

-- C15
(41,  4, 1, 'AVAILABLE'), 
(42,  4, 2, 'AVAILABLE'), 
(43,  4, 3, 'SOLD'), 
(44,  4, 4, 'SOLD'),

-- C16
(51,  5, 1, 'SOLD'), 
(52,  5, 2, 'SOLD'), 
(53,  5, 3, 'SOLD'), 
(54,  5, 4, 'HOLD'),

-- C17
(61,  6, 1, 'AVAILABLE'), 
(62,  6, 2, 'AVAILABLE'), 
(63,  6, 3, 'SOLD'), 
(64,  6, 4, 'SOLD'),

-- C18
(71,  7, 1, 'AVAILABLE'), 
(72,  7, 2, 'SOLD'), 
(73,  7, 3, 'SOLD'), 
(74,  7, 4, 'SOLD'),

-- C19
(81,  8, 1, 'AVAILABLE'), 
(82,  8, 2, 'SOLD'), 
(83,  8, 3, 'SOLD'), 
(84,  8, 4, 'AVAILABLE'),

-- C20
(91,  9, 1, 'AVAILABLE'), 
(92,  9, 2, 'AVAILABLE'), 
(93,  9, 3, 'AVAILABLE'), 
(94,  9, 4, 'AVAILABLE'),

-- C21
(101, 10, 1, 'AVAILABLE'), 
(102, 10, 2, 'SOLD'), 
(103, 10, 3, 'SOLD'), 
(104, 10, 4, 'SOLD'),

-- C22
(111, 11, 1, 'AVAILABLE'), 
(112, 11, 2, 'SOLD'), 
(113, 11, 3, 'SOLD'), 
(114, 11, 4, 'SOLD'),

-- C23
(121, 12, 1, 'AVAILABLE'), 
(122, 12, 2, 'AVAILABLE'), 
(123, 12, 3, 'HOLD'), 
(124, 12, 4, 'AVAILABLE'),

-- C24
(131, 13, 1, 'INVESTOR_UNIT'), 
(132, 13, 2, 'INVESTOR_UNIT'), 
(133, 13, 3, 'SOLD'), 
(134, 13, 4, 'INVESTOR_UNIT'),

-- C25
(141, 14, 1, 'AVAILABLE'), 
(142, 14, 2, 'SOLD'), 
(143, 14, 3, 'SOLD'), 
(144, 14, 4, 'AVAILABLE'),

-- C26
(151, 15, 1, 'SOLD'), 
(152, 15, 2, 'SOLD'), 
(153, 15, 3, 'SOLD'), 
(154, 15, 4, 'AVAILABLE'),

-- C27
(161, 16, 1, 'SOLD'), 
(162, 16, 2, 'INVESTOR_UNIT'), 
(163, 16, 3, 'AVAILABLE'), 
(164, 16, 4, 'SOLD'),

-- C31
(171, 17, 1, 'AVAILABLE'), 
(172, 17, 2, 'AVAILABLE'), 
(173, 17, 3, 'SOLD'), 
(174, 17, 4, 'AVAILABLE'),

-- C37
(181, 18, 1, 'AVAILABLE'), 
(182, 18, 2, 'AVAILABLE'), 
(183, 18, 3, 'AVAILABLE'), 
(184, 18, 4, 'AVAILABLE'),

-- C53
(191, 19, 1, 'SOLD'),
(192, 19, 2, 'SOLD'), 
(193, 19, 3, 'SOLD'), 
(194, 19, 4, 'SOLD'),

-- A17
(201, 20, 1, 'AVAILABLE'), 
(202, 20, 2, 'SOLD'), 
(203, 20, 3, 'AVAILABLE'), 
(204, 20, 4, 'AVAILABLE'),

-- B31
(211, 21, 1, 'AVAILABLE'), 
(212, 21, 2, 'AVAILABLE'), 
(213, 21, 3, 'SOLD'),  
(214, 21, 4, 'SOLD');


-- ==================================================
-- 6. SALES
-- ==================================================

INSERT INTO sales (sale_id, floor_id, broker_id, customer_id, total_value, commission_percent, status)
VALUES
-- C2
(1,  23,  2, 2, 7515000.00, 2.00, 'SOLD'),
(2,  24,  2, 2, 7515000.00, 2.00, 'SOLD'),
-- C15
(3,  43,  3, 4, 7515000.00, 2.00, 'SOLD'),
(4,  44,  3, 4, 7515000.00, 2.00, 'SOLD'),
-- C16
(5,  51,  2, 2, 7515000.00, 2.00, 'SOLD'),
(6,  52,  2, 2, 7515000.00, 2.00, 'SOLD'),  
(7,  53,  2, 2, 7515000.00, 2.00, 'SOLD'),
(8,  54,  2, 2, 7515000.00, 2.00, 'HOLD'),
-- C17
(9,  63,  3, 4, 7515000.00, 2.00, 'SOLD'),
(10, 64,  3, 4, 7515000.00, 2.00, 'SOLD'),
-- C18
(11, 72,  4, 5, 7515000.00, 2.00, 'SOLD'),
(12, 73,  4, 5, 7515000.00, 2.00, 'SOLD'),
(13, 74,  4, 5, 7515000.00, 2.00, 'SOLD'),
-- C19
(14, 82,  1, 1, 7515000.00, 2.00, 'SOLD'),  
(15, 83,  1, 1, 7515000.00, 2.00, 'SOLD'),
-- C21
(16, 102, 3, 4, 7515000.00, 2.00, 'SOLD'),
(17, 103, 3, 4, 7515000.00, 2.00, 'SOLD'),
(18, 104, 3, 4, 7515000.00, 2.00, 'SOLD'),
-- C22
(19, 112, 4, 5, 7515000.00, 2.00, 'SOLD'),
(20, 113, 4, 5, 7515000.00, 2.00, 'SOLD'),
(21, 114, 4, 5, 7515000.00, 2.00, 'SOLD'),
-- C23 
(22, 123, 1, 1, 7515000.00, 2.00, 'HOLD'),
-- C24 
(23, 133, 2, 3, 7515000.00, 2.00, 'SOLD'),
-- C25
(24, 142, 5, 5, 7515000.00, 2.00, 'SOLD'),
(25, 143, 5, 5, 7515000.00, 2.00, 'SOLD'),
-- C26
(26, 151, 2, 2, 7515000.00, 2.00, 'SOLD'),
(27, 152, 2, 2, 7515000.00, 2.00, 'SOLD'),
(28, 153, 2, 2, 7515000.00, 2.00, 'SOLD'),
-- C27
(29, 161, 3, 4, 6210000.00, 2.00, 'SOLD'),
(30, 164, 3, 4, 6210000.00, 2.00, 'SOLD'),
-- C31
(31, 173, 4, 5, 6075000.00, 2.00, 'SOLD'),
-- C53
(32, 191, 5, 2, 5445000.00, 2.00, 'SOLD'),
(33, 192, 5, 2, 5445000.00, 2.00, 'SOLD'),
(34, 193, 5, 2, 5445000.00, 2.00, 'SOLD'),
(35, 194, 5, 2, 5445000.00, 2.00, 'SOLD'),
-- A17
(36, 202, 2, 4, 7515000.00, 2.00, 'SOLD'),
-- B31
(37, 213, 3, 5, 7515000.00, 2.00, 'SOLD'),
(38, 214, 3, 5, 7515000.00, 2.00, 'SOLD');


-- ==================================================
-- 7. LINK active_sale_id on floors
-- ==================================================

UPDATE floors SET active_sale_id = 1  WHERE floor_id = 23;
UPDATE floors SET active_sale_id = 2  WHERE floor_id = 24;
UPDATE floors SET active_sale_id = 3  WHERE floor_id = 43;
UPDATE floors SET active_sale_id = 4  WHERE floor_id = 44;
UPDATE floors SET active_sale_id = 5  WHERE floor_id = 51;
UPDATE floors SET active_sale_id = 6  WHERE floor_id = 52;
UPDATE floors SET active_sale_id = 7  WHERE floor_id = 53;
UPDATE floors SET active_sale_id = 8  WHERE floor_id = 54;
UPDATE floors SET active_sale_id = 9  WHERE floor_id = 63;
UPDATE floors SET active_sale_id = 10 WHERE floor_id = 64;
UPDATE floors SET active_sale_id = 11 WHERE floor_id = 72;
UPDATE floors SET active_sale_id = 12 WHERE floor_id = 73;
UPDATE floors SET active_sale_id = 13 WHERE floor_id = 74;
UPDATE floors SET active_sale_id = 14 WHERE floor_id = 82;
UPDATE floors SET active_sale_id = 15 WHERE floor_id = 83;
UPDATE floors SET active_sale_id = 16 WHERE floor_id = 102;
UPDATE floors SET active_sale_id = 17 WHERE floor_id = 103;
UPDATE floors SET active_sale_id = 18 WHERE floor_id = 104;
UPDATE floors SET active_sale_id = 19 WHERE floor_id = 112;
UPDATE floors SET active_sale_id = 20 WHERE floor_id = 113;
UPDATE floors SET active_sale_id = 21 WHERE floor_id = 114;
UPDATE floors SET active_sale_id = 22 WHERE floor_id = 123;
UPDATE floors SET active_sale_id = 23 WHERE floor_id = 133;
UPDATE floors SET active_sale_id = 24 WHERE floor_id = 142;
UPDATE floors SET active_sale_id = 25 WHERE floor_id = 143;
UPDATE floors SET active_sale_id = 26 WHERE floor_id = 151;
UPDATE floors SET active_sale_id = 27 WHERE floor_id = 152;
UPDATE floors SET active_sale_id = 28 WHERE floor_id = 153;
UPDATE floors SET active_sale_id = 29 WHERE floor_id = 161;
UPDATE floors SET active_sale_id = 30 WHERE floor_id = 164;
UPDATE floors SET active_sale_id = 31 WHERE floor_id = 173;
UPDATE floors SET active_sale_id = 32 WHERE floor_id = 191;
UPDATE floors SET active_sale_id = 33 WHERE floor_id = 192;
UPDATE floors SET active_sale_id = 34 WHERE floor_id = 193;
UPDATE floors SET active_sale_id = 35 WHERE floor_id = 194;
UPDATE floors SET active_sale_id = 36 WHERE floor_id = 202;
UPDATE floors SET active_sale_id = 37 WHERE floor_id = 213;
UPDATE floors SET active_sale_id = 38 WHERE floor_id = 214;


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
    (23, 2, 'AVAILABLE', 'SOLD'),
    (43, 3, 'AVAILABLE', 'SOLD'),
    (51, 2, 'AVAILABLE', 'SOLD'),
    (52, 2, 'AVAILABLE', 'SOLD'),  
    (54, 2, 'AVAILABLE', 'HOLD');

-- EOF!!!
