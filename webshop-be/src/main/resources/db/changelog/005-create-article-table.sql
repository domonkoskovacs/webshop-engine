create table image_metadata
(
    id                 uuid default uuid_generate_v4() primary key,
    url                varchar(1000),
    filename           varchar(255) not null,
    extension          varchar(10)  not null,
    storage_type       varchar(20)  not null,
    product_id         uuid references product (id),
    creation_time      timestamp    not null,
    last_modified_time timestamp
);


create table article
(
    id                 uuid default uuid_generate_v4() primary key,
    article_name       varchar(100) not null,
    article_text       varchar(100) not null,
    button_text        varchar(100) not null,
    button_link        varchar(255) not null,
    image_id           uuid         not null references image_metadata (id),
    creation_time      timestamp    not null,
    last_modified_time timestamp
);