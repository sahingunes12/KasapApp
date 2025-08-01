-- Calendar and Appointment System
-- Migration: 004_calendar_system.sql

-- Note: time_slots and appointments tables already exist from initial schema
-- This migration only adds the appointment_status enum and sample data

-- Create appointment_status enum if not exists
DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert sample time slots for the next 30 days
INSERT INTO time_slots (date, start_time, end_time, max_capacity)
SELECT 
    CURRENT_DATE + (i || ' days')::INTERVAL AS date,
    '09:00'::TIME AS start_time,
    '10:00'::TIME AS end_time,
    3 AS max_capacity
FROM generate_series(0, 29) AS i
WHERE EXTRACT(DOW FROM CURRENT_DATE + (i || ' days')::INTERVAL) NOT IN (5, 6) -- Exclude weekends
UNION ALL
SELECT 
    CURRENT_DATE + (i || ' days')::INTERVAL AS date,
    '10:00'::TIME AS start_time,
    '11:00'::TIME AS end_time,
    3 AS max_capacity
FROM generate_series(0, 29) AS i
WHERE EXTRACT(DOW FROM CURRENT_DATE + (i || ' days')::INTERVAL) NOT IN (5, 6)
UNION ALL
SELECT 
    CURRENT_DATE + (i || ' days')::INTERVAL AS date,
    '11:00'::TIME AS start_time,
    '12:00'::TIME AS end_time,
    3 AS max_capacity
FROM generate_series(0, 29) AS i
WHERE EXTRACT(DOW FROM CURRENT_DATE + (i || ' days')::INTERVAL) NOT IN (5, 6)
UNION ALL
SELECT 
    CURRENT_DATE + (i || ' days')::INTERVAL AS date,
    '14:00'::TIME AS start_time,
    '15:00'::TIME AS end_time,
    3 AS max_capacity
FROM generate_series(0, 29) AS i
WHERE EXTRACT(DOW FROM CURRENT_DATE + (i || ' days')::INTERVAL) NOT IN (5, 6)
UNION ALL
SELECT 
    CURRENT_DATE + (i || ' days')::INTERVAL AS date,
    '15:00'::TIME AS start_time,
    '16:00'::TIME AS end_time,
    3 AS max_capacity
FROM generate_series(0, 29) AS i
WHERE EXTRACT(DOW FROM CURRENT_DATE + (i || ' days')::INTERVAL) NOT IN (5, 6)
UNION ALL
SELECT 
    CURRENT_DATE + (i || ' days')::INTERVAL AS date,
    '16:00'::TIME AS start_time,
    '17:00'::TIME AS end_time,
    3 AS max_capacity
FROM generate_series(0, 29) AS i
WHERE EXTRACT(DOW FROM CURRENT_DATE + (i || ' days')::INTERVAL) NOT IN (5, 6); 