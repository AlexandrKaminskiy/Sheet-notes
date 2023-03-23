ALTER table sheet_note
ADD column client_id INTEGER REFERENCES client (id);