create table saved
(
    id         uuid default uuid_generate_v4() primary key,
    user_id    uuid references webshop_user (id) on delete cascade not null,
    product_id uuid references product (id) on delete cascade      not null
);

create table cart
(
    id                 uuid default uuid_generate_v4() primary key,
    user_id            uuid references webshop_user (id) on delete cascade not null,
    product_id         uuid references product (id) on delete cascade      not null,
    count              integer                                             not null,
    creation_time      timestamp                                           not null,
    last_modified_time timestamp
);