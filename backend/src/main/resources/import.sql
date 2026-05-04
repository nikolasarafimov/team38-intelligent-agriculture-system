INSERT INTO "user" (id, full_name, email, password)
VALUES (1, 'Test User', 'test@example.com', 'password123')
    ON CONFLICT (id) DO NOTHING;