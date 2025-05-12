create table webshop_category
(
    id                 uuid default uuid_generate_v4() primary key,
    category_name      varchar(100) not null,
    creation_time      timestamp    not null,
    last_modified_time timestamp
);

create table sub_category
(
    id                 uuid default uuid_generate_v4() primary key,
    sub_category_name  varchar(100)                                            not null,
    category_id        uuid references webshop_category (id) on delete cascade not null,
    creation_time      timestamp                                               not null,
    last_modified_time timestamp
);

create table brand
(
    id                 uuid default uuid_generate_v4() primary key,
    brand_name         varchar(100) not null,
    creation_time      timestamp    not null,
    last_modified_time timestamp
);

create table product
(
    id                  uuid default uuid_generate_v4() primary key,
    brand_id            uuid references brand (id)        not null,
    product_name        varchar(255)                      not null,
    description         varchar(1000)                     not null,
    sub_category_id     uuid references sub_category (id) not null,
    gender              varchar(10)                       not null,
    count               integer                           not null,
    price               double precision                  not null,
    discount_percentage double precision                  not null,
    item_number         varchar(255)                      not null,
    creation_time       timestamp                         not null,
    last_modified_time  timestamp
);