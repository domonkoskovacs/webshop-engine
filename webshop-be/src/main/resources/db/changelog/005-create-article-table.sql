create table image_metadata
(
    id                 uuid default uuid_generate_v4() primary key,
    url                varchar   ,
    filename           varchar   not null,
    extension          varchar   not null,
    storage_type       varchar   not null,
    product_id         uuid references product (id),
    creation_time      timestamp not null,
    last_modified_time timestamp
);


create table article
(
    id                 uuid default uuid_generate_v4() primary key,
    article_name       varchar   not null,
    article_text       varchar   not null,
    button_text        varchar   not null,
    button_link        varchar   not null,
    image_id           uuid      not null references image_metadata (id),
    creation_time      timestamp not null,
    last_modified_time timestamp
);