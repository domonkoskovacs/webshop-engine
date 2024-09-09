create table webshop_user
(
    id                  uuid default uuid_generate_v4() primary key,
    email               varchar(255) unique not null,
    firstname           varchar(255)        not null,
    lastname            varchar(255)        not null,
    user_password       varchar(255)        not null,
    user_role           varchar(255)        not null,
    verified            boolean             not null,
    phone_number        varchar(255)        not null,
    gender              varchar(255),
    subscribed_to_email bool                not null,
    shipping_address_id uuid references address (id),
    billing_address_id  uuid references address (id),
    creation_time       timestamp           not null,
    last_modified_time  timestamp
);