-- Write your migrate up statements here

BEGIN;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telegram_id INT,
    registed TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE todo_lists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE users_lists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    list_id INT REFERENCES todo_lists(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE todo_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    done BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE lists_items (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES todo_items(id) ON DELETE CASCADE NOT NULL,
    list_id INT REFERENCES todo_lists(id) ON DELETE CASCADE NOT NULL
);


COMMIT;

---- create above / drop below ----

BEGIN;

DROP TABLE lists_items;

DROP TABLE users_lists;

DROP TABLE todo_lists;

DROP TABLE users;

DROP TABLE todo_items;

COMMIT;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.