CREATE TABLE user_avatar (
	id SERIAL PRIMARY KEY UNIQUE,
	name TEXT,
	date_created TIMESTAMPTZ DEFAULT now(),
	img_type TEXT NOT NULL,
	img_file bytea NOT NULL,
    user_id INTEGER
        REFERENCES user_information(id) ON DELETE CASCADE NOT NULL
);