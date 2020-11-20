CREATE TYPE STACK_PREFERENCE AS ENUM (
    'Backend',
    'Frontend',
    'Full Stack'
);

ALTER TABLE user_information
    ADD COLUMN
        user_stack STACK_PREFERENCE NOT NULL