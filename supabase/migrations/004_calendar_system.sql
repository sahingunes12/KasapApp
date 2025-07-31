-- Calendar and Appointment System
-- Migration: 004_calendar_system.sql

-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 1,
    current_bookings INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    status appointment_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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