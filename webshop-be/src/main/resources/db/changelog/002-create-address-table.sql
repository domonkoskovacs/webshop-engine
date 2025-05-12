create table address
(
    id                 uuid default uuid_generate_v4() primary key,
    country            varchar(100)                                        not null,
    zip_code           integer                                             not null,
    city               varchar(100)                                        not null,
    street             varchar(150)                                        not null,
    street_number      integer                                             not null,
    floor_number       varchar(10)                                         not null,
    address_type       varchar(8)                                          not null,
    user_id            uuid references webshop_user (id) on delete cascade not null,
    creation_time      timestamp                                           not null,
    last_modified_time timestamp
);