create table webshop_category
(
    id                 uuid default uuid_generate_v4() primary key,
    category_name      varchar   not null,
    creation_time      timestamp not null,
    last_modified_time timestamp
);

create table sub_category
(
    id                 uuid default uuid_generate_v4() primary key,
    sub_category_name  varchar                               not null,
    category_id        uuid references webshop_category (id) not null,
    creation_time      timestamp                             not null,
    last_modified_time timestamp
);

create table brand
(
    id                 uuid default uuid_generate_v4() primary key,
    brand_name         varchar   not null,
    creation_time      timestamp not null,
    last_modified_time timestamp
);

create table product
(
    id                  uuid default uuid_generate_v4() primary key,
    brand_id            uuid references brand (id)        not null,
    product_name        varchar(255)                      not null,
    description         varchar(1000)                     not null,
    sub_category_id     uuid references sub_category (id) not null,
    product_type        varchar(255)                      not null,
    count               integer                           not null,
    price               float                             not null,
    discount_percentage float,
    image_url_list      varchar(10000),
    item_number         varchar(255)                      not null,
    creation_time       timestamp                         not null,
    last_modified_time  timestamp
);