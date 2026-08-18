-- migrate:up

CREATE TABLE community (userid INT  NOT NULL REFERENCES users(userid) , community_id SERIAL PRIMARY KEY  ,  community_name TEXT NOT NULL , community_passkey  TEXT NOT NULL , community_description VARCHAR(250) NOT NULL , community_bg_image TEXT NOT NULL , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);


CREATE TABLE members (userid INT NOT NULL REFERENCES users (userid) , community_id INT NOT NULL REFERENCES community(community_id) , joined_date TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (userid , community_id));


-- migrate:down