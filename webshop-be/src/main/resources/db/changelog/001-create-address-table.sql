CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table address
(
    id                 uuid default uuid_generate_v4() primary key,
    country            varchar(255) not null,
    zip_code           integer      not null,
    city               varchar(255) not null,
    street             varchar(255) not null,
    street_number      integer      not null,
    floor_number       varchar(255) not null,
    creation_time      timestamp    not null,
    last_modified_time timestamp
);