create table image
(
    id                 uuid default uuid_generate_v4() primary key,
    image_data         oid       not null,
    creation_time      timestamp not null,
    last_modified_time timestamp
)