create table webshop_order
(
    id                 uuid default uuid_generate_v4() primary key,
    order_date         timestamp                         not null,
    total_price        double precision                  not null,
    payment_method     varchar                           not null,
    order_status       varchar                           not null,
    user_id            uuid references webshop_user (id) not null,
    creation_time      timestamp                         not null,
    last_modified_time timestamp
);

create table order_item
(
    id                 uuid default uuid_generate_v4() primary key,
    order_id           uuid references webshop_order (id) not null,
    product_id         uuid references product (id)       not null,
    count              integer                            not null,
    creation_time      timestamp                          not null,
    last_modified_time timestamp
);



