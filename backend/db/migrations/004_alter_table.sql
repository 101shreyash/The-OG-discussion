-- migrate:up


ALTER TABLE users ADD COLUMN joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ;

ALTER TABLE community ADD COLUMN community_type TEXT NOT NULL ;


-- migrate:down