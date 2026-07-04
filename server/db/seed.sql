-- JeevanCare+ Seed Data
-- Mock/dummy data for nurses and example placeholder rows for other modules
USE jeevancare_db;

-- ============================================
-- MOCK NURSES (Clearly dummy data)
-- ============================================
INSERT INTO nurses (name, experience_years, specialization, rating, availability_type, daily_rate, photo_url, phone, bio, city, state) VALUES
('Priya Sharma', 8, 'elderly care', 4.8, 'all', 1500.00, '/images/nurses/nurse1.jpg', '9876543201', 'Experienced in geriatric care with 8 years of dedicated service. Certified in elderly patient management and palliative care.', 'Hyderabad', 'Telangana'),
('Ravi Kumar', 5, 'post-op', 4.5, 'daily', 1800.00, '/images/nurses/nurse2.jpg', '9876543202', 'Specialized in post-operative care with expertise in wound management and patient rehabilitation.', 'Hyderabad', 'Telangana'),
('Anjali Reddy', 12, 'ICU', 4.9, 'all', 2500.00, '/images/nurses/nurse3.jpg', '9876543203', 'Senior ICU nurse with 12 years of critical care experience. Trained in ventilator management and emergency protocols.', 'Hyderabad', 'Telangana'),
('Mohammed Farhan', 3, 'general', 4.2, 'one-time', 1200.00, '/images/nurses/nurse4.jpg', '9876543204', 'General nursing care specialist. Skilled in vital monitoring, medication administration, and patient comfort.', 'Hyderabad', 'Telangana'),
('Lakshmi Devi', 10, 'pediatric', 4.7, 'all', 1600.00, '/images/nurses/nurse5.jpg', '9876543205', 'Pediatric nursing specialist with a decade of experience in child healthcare, vaccinations, and neonatal care.', 'Hyderabad', 'Telangana'),
('Suresh Babu', 6, 'elderly care', 4.4, 'weekly', 1400.00, '/images/nurses/nurse6.jpg', '9876543206', 'Compassionate caregiver specializing in elderly home care. Certified in dementia care and mobility assistance.', 'Hyderabad', 'Telangana'),
('Kavitha Nair', 7, 'post-op', 4.6, 'daily', 1700.00, '/images/nurses/nurse7.jpg', '9876543207', 'Post-surgical recovery specialist with training in orthopedic and cardiac post-op care.', 'Hyderabad', 'Telangana'),
('Deepak Verma', 4, 'general', 4.3, 'all', 1300.00, '/images/nurses/nurse8.jpg', '9876543208', 'Versatile general nurse experienced in home healthcare, chronic disease management, and patient education.', 'Hyderabad', 'Telangana'),
('Fatima Begum', 15, 'ICU', 5.0, 'daily', 3000.00, '/images/nurses/nurse9.jpg', '9876543209', 'Head nurse with 15 years of ICU and critical care experience. Expert in trauma care and advanced life support.', 'Hyderabad', 'Telangana'),
('Arjun Rao', 2, 'pediatric', 4.1, 'one-time', 1100.00, '/images/nurses/nurse10.jpg', '9876543210', 'Young and energetic pediatric nurse passionate about child health and wellness. Recently certified in PALS.', 'Hyderabad', 'Telangana');

-- ============================================
-- MOCK NURSE REVIEWS
-- ============================================
INSERT INTO nurse_reviews (nurse_id, reviewer_name, rating, comment) VALUES
(1, 'Ramesh K.', 5.0, 'Priya took excellent care of my mother. Very patient and knowledgeable.'),
(1, 'Sunita P.', 4.5, 'Professional and caring. Highly recommended for elderly care.'),
(1, 'Venkat R.', 4.8, 'My father felt very comfortable with Priya. She is thorough and kind.'),
(2, 'Anil S.', 4.5, 'Ravi was very helpful during my recovery after knee surgery.'),
(2, 'Meena D.', 4.5, 'Good post-op care. He follows all protocols carefully.'),
(3, 'Srinivas M.', 5.0, 'Anjali is the best ICU nurse we have ever had. Saved my father during a critical moment.'),
(3, 'Padma L.', 4.8, 'Extremely skilled and calm under pressure. A true professional.'),
(4, 'Rajesh T.', 4.0, 'Mohammed provided good basic care for a one-time visit. No complaints.'),
(4, 'Swathi N.', 4.3, 'Reliable and punctual. Good for general check-ups at home.'),
(5, 'Harini V.', 4.7, 'Lakshmi is wonderful with children. My kids love her!'),
(5, 'Prakash G.', 4.8, 'Outstanding pediatric care. Very gentle and experienced.'),
(6, 'Bhavani S.', 4.5, 'Suresh took great care of my grandmother for two weeks. Very reliable.'),
(7, 'Madhavi R.', 4.6, 'Kavitha helped my husband recover smoothly after his surgery.'),
(8, 'Naresh B.', 4.2, 'Deepak is a competent general nurse. Handles everything professionally.'),
(9, 'Chandra K.', 5.0, 'Fatima is simply the best. Her ICU experience is unmatched.'),
(9, 'Sravani P.', 5.0, 'We were lucky to have Fatima during a medical emergency. Life saver!'),
(10, 'Keerthi M.', 4.0, 'Arjun is young but very dedicated. Good with children.');

-- ============================================
-- EXAMPLE HOSPITAL (Placeholder — Replace with real data)
-- ============================================
INSERT INTO hospitals (name, type, address, city, state, lat, lng, contact_number, facilities, description) VALUES
('Example Government Hospital (Replace with real data)', 'government', '123 Example Street, Hyderabad', 'Hyderabad', 'Telangana', 17.385044, 78.486671, '040-12345678', '["Emergency 24/7", "ICU", "Blood Bank", "Ambulance", "Pharmacy", "X-Ray", "Laboratory"]', 'This is a placeholder hospital entry. Replace with real hospital data.'),
('Example Private Hospital (Replace with real data)', 'private', '456 Sample Road, Hyderabad', 'Hyderabad', 'Telangana', 17.395044, 78.476671, '040-87654321', '["Emergency 24/7", "ICU", "NICU", "Blood Bank", "Ambulance", "Pharmacy", "MRI", "CT Scan", "Dialysis"]', 'This is a placeholder hospital entry. Replace with real hospital data.');

-- ============================================
-- EXAMPLE HOSPITAL DOCTORS (Placeholder)
-- ============================================
INSERT INTO hospital_doctors (hospital_id, name, specialization, qualification, experience_years, photo_url, timings, consultation_fee, bio) VALUES
(1, 'Dr. Example Physician (Replace)', 'General Medicine', 'MBBS, MD', 15, '/images/doctors/doc1.jpg', 'Mon-Sat 9:00 AM - 4:00 PM', 200.00, 'Placeholder doctor entry. Replace with real data.'),
(1, 'Dr. Example Surgeon (Replace)', 'General Surgery', 'MBBS, MS', 20, '/images/doctors/doc2.jpg', 'Mon-Fri 10:00 AM - 3:00 PM', 300.00, 'Placeholder doctor entry. Replace with real data.'),
(2, 'Dr. Example Cardiologist (Replace)', 'Cardiology', 'MBBS, DM Cardiology', 12, '/images/doctors/doc3.jpg', 'Mon-Sat 9:00 AM - 5:00 PM', 500.00, 'Placeholder doctor entry. Replace with real data.');
