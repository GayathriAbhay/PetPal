-- SQL seed for pets and medical_records
-- Run this against your TiDB/MySQL database once the schema exists

INSERT INTO `pets` (id, name, species, breed, age, sex, neutered, microchip, color, weightKg, bio, createdAt)
VALUES
('ckpet1', 'Bella', 'Dog', 'Labrador Retriever', 4, 'Female', 1, '985001234567891', 'Yellow', 28.5, 'Loves fetch and swimming. Great with kids.', NOW()),
('ckpet2', 'Mittens', 'Cat', 'Domestic Short Hair', 2, 'Male', 1, '985009876543210', 'Tabby', 4.3, 'Curious and playful. Prefers warm laps.', NOW()),
('ckpet3', 'Pebble', 'Rabbit', 'Dutch', 1, 'Female', 0, NULL, 'Black & White', 2.1, 'Gentle and shy. Likes leafy greens.', NOW());

INSERT INTO `medical_records` (id, petId, date, description, diagnosis, treatment, vetName, notes, createdAt)
VALUES
('ckmed1', 'ckpet1', '2024-02-10', 'Annual vaccination and wellness check', 'Healthy', 'Rabies vaccine administered', 'Happy Paws Clinic', 'Recommended continuing joint supplements.', NOW()),
('ckmed2', 'ckpet2', '2024-06-01', 'Ear infection treatment', 'Otitis externa', 'Topical antibiotic drops for 10 days', 'Cat Care Center', 'Follow-up in 2 weeks.', NOW()),
('ckmed3', 'ckpet3', '2024-08-15', 'Check-up; dietary advice', 'Healthy', 'Switch to high-fiber pellets', 'Bunny Wellness', 'Monitor weight for 1 month.', NOW());
