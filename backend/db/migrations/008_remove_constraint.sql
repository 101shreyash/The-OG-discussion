-- migrate:up


ALTER TABLE community
DROP CONSTRAINT community_name_unique;


-- migrate:down
