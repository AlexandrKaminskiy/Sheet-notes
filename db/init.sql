CREATE TABLE sheet_note (
    id SERIAL,
    name VARCHAR, 
    description VARCHAR,
    bpm INTEGER,
    complexity INTEGER,
    duration INTEGER,
    creation_date DATE,
    instrument VARCHAR
);