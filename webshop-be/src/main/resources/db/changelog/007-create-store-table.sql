create table store
(
    id                               uuid default uuid_generate_v4() primary key,
    name                             varchar(30)      not null,
    min_order_price                  double precision not null,
    shipping_price                   double precision not null,
    return_period                    integer          not null,
    unpaid_order_cancel_hours        integer          not null,
    delete_out_of_stock_products     boolean          not null,
    enable_built_in_marketing_emails boolean          not null,
    creation_time                    timestamp        not null,
    last_modified_time               timestamp
);