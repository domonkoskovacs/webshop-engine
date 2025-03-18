create table article
(
    id                 uuid default uuid_generate_v4() primary key,
    article_name       varchar   not null,
    article_text       varchar   not null,
    button_text        varchar   not null,
    button_link        varchar   not null,
    image_url          varchar   not null,
    creation_time      timestamp not null,
    last_modified_time timestamp
);