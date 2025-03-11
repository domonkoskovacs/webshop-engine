create table store
(
    id                               uuid default uuid_generate_v4() primary key,
    min_order_price                  double precision not null,
    shipping_price                   double precision not null,
    return_period                    integer          not null,
    theme                            varchar,
    primary_color                    varchar,
    secondary_color                  varchar,
    delete_out_of_stock_products     bool             not null,
    delete_unused_pictures           bool             not null,
    enable_built_in_marketing_emails bool             not null,
    creation_time                    timestamp        not null,
    last_modified_time               timestamp
);