-- Departments
INSERT INTO departments (id, name) VALUES
('electricity', 'Electricity Utility'),
('gas', 'Gas Distribution'),
('municipal', 'Municipal Corporation')
ON CONFLICT (id) DO NOTHING;

-- Services (Electricity)
INSERT INTO services (id, department_id, name, type, requires_payment, requires_documents) VALUES
('elec_pay_bill', 'electricity', 'Pay Electricity Bill', 'PAYMENT', TRUE, FALSE),
('elec_outage_complaint', 'electricity', 'Power Outage Complaint', 'COMPLAINT', FALSE, TRUE),
('elec_new_connection', 'electricity', 'New Electricity Connection', 'REQUEST', FALSE, TRUE),
('elec_meter_issue', 'electricity', 'Meter Issue Complaint', 'COMPLAINT', FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Services (Gas)
INSERT INTO services (id, department_id, name, type, requires_payment, requires_documents) VALUES
('gas_pay_bill', 'gas', 'Pay Gas Bill', 'PAYMENT', TRUE, FALSE),
('gas_leakage_complaint', 'gas', 'Gas Leakage Complaint', 'COMPLAINT', FALSE, TRUE),
('gas_new_connection', 'gas', 'New Gas Connection', 'REQUEST', FALSE, TRUE),
('gas_refill_booking', 'gas', 'Gas Refill Booking', 'REQUEST', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Services (Municipal - expanded)
INSERT INTO services (id, department_id, name, type, requires_payment, requires_documents) VALUES
('mun_water_complaint', 'municipal', 'Water Supply Complaint', 'COMPLAINT', FALSE, TRUE),
('mun_waste_complaint', 'municipal', 'Waste Pickup Complaint', 'COMPLAINT', FALSE, TRUE),
('mun_streetlight_complaint', 'municipal', 'Street Light Complaint', 'COMPLAINT', FALSE, TRUE),
('mun_road_pothole', 'municipal', 'Road Damage / Pothole Complaint', 'COMPLAINT', FALSE, TRUE),
('mun_property_tax', 'municipal', 'Property Tax Payment', 'PAYMENT', TRUE, FALSE),
('mun_birth_cert', 'municipal', 'Birth Certificate Request', 'REQUEST', FALSE, TRUE),
('mun_death_cert', 'municipal', 'Death Certificate Request', 'REQUEST', FALSE, TRUE),
('mun_trade_license', 'municipal', 'Trade License Request', 'REQUEST', FALSE, TRUE),
('mun_drainage', 'municipal', 'Drainage Blockage Complaint', 'COMPLAINT', FALSE, TRUE),
('mun_sanitation', 'municipal', 'Public Toilet Sanitation Complaint', 'COMPLAINT', FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;
