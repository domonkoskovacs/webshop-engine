create table webshop_order
(
    id                 uuid default uuid_generate_v4() primary key,
    order_date         timestamp                         not null,
    order_number       varchar(255) unique               not null,
    total_price        double precision                  not null,
    shipping_price     double precision                  not null,
    payment_method     varchar                           not null,
    order_status       varchar                           not null,
    payment_intent_id  varchar,
    refund_id          varchar,
    paid_date          timestamp,
    refunded_date      timestamp,
    user_id            uuid references webshop_user (id) not null,
    creation_time      timestamp                         not null,
    last_modified_time timestamp
);

create table order_item
(
    id                 uuid default uuid_generate_v4() primary key,
    order_id           uuid references webshop_order (id) not null,
    product_name       varchar(255)                       not null,
    individual_price   double precision                   not null,
    thumbnail_url      varchar(255),
    gender             varchar(255)                       not null,
    category_name      varchar(255)                       not null,
    subcategory_name   varchar(255)                       not null,
    product_id         uuid                               not null,
    count              integer                            not null,
    creation_time      timestamp                          not null,
    last_modified_time timestamp
);



