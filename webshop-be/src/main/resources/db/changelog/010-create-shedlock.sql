create table shedlock
(
    name       varchar unique not null primary key,
    lock_until timestamp      not null,
    locked_at  timestamp      not null,
    locked_by  varchar        not null
);