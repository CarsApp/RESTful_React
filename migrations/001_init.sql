-- Write your migrate up statements here

BEGIN;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registed TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMIT;

---- create above / drop below ----

BEGIN;

drop table users;

COMMIT;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.