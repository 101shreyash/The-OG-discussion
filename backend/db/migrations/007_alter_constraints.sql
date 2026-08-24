-- migrate:up

ALTER TABLE community
ADD CONSTRAINT community_name_unique UNIQUE (community_name);


-- migrate:down

