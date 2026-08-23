-- migrate:up

ALTER TABLE users
DROP CONSTRAINT users_profile_picture_key;

-- migrate:down