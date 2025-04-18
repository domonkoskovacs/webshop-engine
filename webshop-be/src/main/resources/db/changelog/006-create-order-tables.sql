create table webshop_order
(
    id                 uuid default uuid_generate_v4() primary key,
    order_date         timestamp                         not null,
    order_number       varchar(255) unique               not null,
    total_price        double precision                  not null,
    shipping_price     double precision                  not null,
    payment_method     varchar(20)                       not null,
    order_status       varchar(30)                       not null,
    payment_intent_id  varchar(100),
    refund_id          varchar(100),
    paid_date          timestamp,
    refunded_date      timestamp,
    delivered_date     timestamp,
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
    thumbnail_url      varchar(1000),
    gender             varchar(10)                        not null,
    category_name      varchar(100)                       not null,
    subcategory_name   varchar(100)                       not null,
    product_id         uuid                               not null,
    count              integer                            not null,
    returned_count     integer                            not null,
    creation_time      timestamp                          not null,
    last_modified_time timestamp
);



