-- Insert event details into events table
INSERT_EVENT = INSERT INTO events (name, type, owner_full_name, owner_phone, address, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?);

-- Insert halls for the event into the event_halls table
INSERT_EVENT_HALLS = INSERT INTO event_halls (event_id, hall_id) VALUES (?, ?);

-- Select three random employees for the event
SELECT_RANDOM_EMPLOYEES = SELECT id FROM employees ORDER BY RANDOM() LIMIT 3;

-- Select all events
SELECT_ALL_EVENTS = SELECT * FROM events;

-- Select a specific event by ID
SELECT_EVENT_BY_ID = SELECT * FROM events WHERE id = ?;

-- Select halls for a specific event
SELECT_HALLS_FOR_EVENT = SELECT h.name FROM halls h INNER JOIN event_halls eh ON h.id = eh.hall_id WHERE eh.event_id = ?;

-- Select customers for a specific event
SELECT_CUSTOMERS_FOR_EVENT = SELECT c.name FROM customers c INNER JOIN event_customers ec ON c.id = ec.customer_id WHERE ec.event_id = ?;

-- Select employees for a specific event
SELECT_EMPLOYEES_FOR_EVENT = SELECT e.name FROM employees e INNER JOIN event_employees ee ON e.id = ee.employee_id WHERE ee.event_id = ?;

-- Delete an event by ID
DELETE_EVENT_BY_ID = DELETE FROM events WHERE id = ?;

-- Delete event halls by event ID
DELETE_EVENT_HALLS_BY_EVENT_ID = DELETE FROM event_halls WHERE event_id = ?;

-- Delete event customers by event ID
DELETE_EVENT_CUSTOMERS_BY_EVENT_ID = DELETE FROM event_customers WHERE event_id = ?;

-- Delete event employees by event ID
DELETE_EVENT_EMPLOYEES_BY_EVENT_ID = DELETE FROM event_employees WHERE event_id = ?;
