create table promotion_email
(
    id                  uuid default uuid_generate_v4() primary key,
    name                varchar unique not null,
    email_text          varchar        not null,
    email_subject       varchar        not null,
    email_image         varchar        not null,
    day_of_week         varchar        not null,
    hour_of_recurring   integer        not null,
    minute_of_recurring integer        not null,
    creation_time       timestamp      not null,
    last_modified_time  timestamp
);