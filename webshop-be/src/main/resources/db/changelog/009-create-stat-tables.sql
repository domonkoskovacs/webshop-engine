create table email_stat
(
    id                 uuid default uuid_generate_v4() primary key,
    sent               integer   not null,
    email_type         varchar   not null,
    creation_time      timestamp not null,
    last_modified_time timestamp
);