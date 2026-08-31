-- migrate:up


CREATE TABLE post (userid INT NOT NULL REFERENCES users(userid) , communityid INT NOT NULL REFERENCES community(community_id) , postid SERIAL PRIMARY KEY , post_content TEXT NOT NULL , posted_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL);


-- migrate:down