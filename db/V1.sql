CREATE TABLE client (
    id SERIAL PRIMARY KEY ,
    username VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    password VARCHAR,
    is_active BOOLEAN
);

CREATE TABLE jwt_holder (
    access_token VARCHAR,
    refresh_token VARCHAR,
    client_id INTEGER REFERENCES client (id) UNIQUE
);