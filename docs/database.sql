
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);


CREATE TABLE parcels (
    id SERIAL PRIMARY KEY,
    user_id INT,
    location VARCHAR(255),
    size DECIMAL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    parcel_id INT,
    name VARCHAR(100),
    type VARCHAR(100),
    FOREIGN KEY (parcel_id) REFERENCES parcels(id)
);


CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    crop_id INT,
    type VARCHAR(100),
    date DATE,
    description TEXT,
    FOREIGN KEY (crop_id) REFERENCES crops(id)
);


CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    crop_id INT,
    text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(id)
);