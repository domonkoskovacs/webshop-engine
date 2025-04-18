create table promotion_email
(
    id                  uuid default uuid_generate_v4() primary key,
    name                varchar(100) unique not null,
    email_text          varchar(1000)       not null,
    email_subject       varchar(100)        not null,
    email_image         varchar(1000)       not null,
    day_of_week         varchar(20)         not null,
    hour_of_recurring   integer             not null,
    minute_of_recurring integer             not null,
    creation_time       timestamp           not null,
    last_modified_time  timestamp
);