-- migrate:up

CREATE TABLE users (userid SERIAL PRIMARY KEY , username TEXT NOT NULL UNIQUE , hash_password TEXT NOT NULL , profile_picture TEXT UNIQUE NOT NULL );


-- migrate:down

DROP TABLE users;

