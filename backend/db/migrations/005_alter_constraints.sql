-- migrate:up


ALTER TABLE users ALTER COLUMN profile_picture DROP NOT NULL;
ALTER TABLE users ALTER COLUMN nickname DROP NOT NULL;


-- migrate:down