CREATE TABLE IF NOT EXISTS Price (
    timestamp INT NOT NULL,
    token TEXT NOT NULL,
    price FLOAT NOT NULL,
    PRIMARY KEY (timestamp, token)
);