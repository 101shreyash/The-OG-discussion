-- migrate:up

ALTER TABLE users ADD COLUMN nickname TEXT NOT NULL ;


-- migrate:down
