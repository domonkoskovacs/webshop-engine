CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table webshop_user
(
    id                  uuid default uuid_generate_v4() primary key,
    email               varchar(255) unique not null,
    firstname           varchar(100)        not null,
    lastname            varchar(100)        not null,
    user_password       varchar(60)         not null,
    user_role           varchar(10)         not null,
    verified            boolean             not null,
    phone_number        varchar(20)         not null,
    gender              varchar(10),
    subscribed_to_email boolean             not null,
    creation_time       timestamp           not null,
    last_modified_time  timestamp
);