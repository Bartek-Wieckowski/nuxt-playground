-- ============================================================
-- E-COMMERCE SCHEMA: 2 stores, full enterprise structure
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- STORES & ORGANIZATION
-- ============================================================

create table stores (
  id serial primary key,
  name varchar(100) not null,
  slug varchar(100) unique not null,
  description text,
  country varchar(2) not null,
  currency varchar(3) not null default 'PLN',
  timezone varchar(50) not null default 'Europe/Warsaw',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table departments (
  id serial primary key,
  store_id int references stores(id),
  name varchar(100) not null,
  description text
);

create table employees (
  id serial primary key,
  store_id int references stores(id),
  department_id int references departments(id),
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  email varchar(255) unique not null,
  role varchar(50) not null, -- manager, warehouse, sales, support
  hired_at date not null,
  is_active boolean not null default true
);

-- ============================================================
-- PRODUCTS
-- ============================================================

create table categories (
  id serial primary key,
  store_id int references stores(id),
  parent_id int references categories(id),
  name varchar(100) not null,
  slug varchar(100) not null,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  unique(store_id, slug)
);

create table suppliers (
  id serial primary key,
  name varchar(255) not null,
  country varchar(2) not null,
  contact_email varchar(255),
  contact_phone varchar(50),
  lead_time_days int,
  is_active boolean not null default true
);

create table products (
  id serial primary key,
  store_id int not null references stores(id),
  category_id int references categories(id),
  supplier_id int references suppliers(id),
  sku varchar(100) unique not null,
  name varchar(255) not null,
  description text,
  base_price numeric(10,2) not null,
  cost_price numeric(10,2),
  tax_rate numeric(5,2) not null default 23.00,
  weight_kg numeric(6,3),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table product_variants (
  id serial primary key,
  product_id int not null references products(id) on delete cascade,
  sku varchar(100) unique not null,
  size varchar(50),
  color varchar(50),
  material varchar(100),
  price_modifier numeric(10,2) not null default 0,
  is_active boolean not null default true
);

create table product_images (
  id serial primary key,
  product_id int not null references products(id) on delete cascade,
  variant_id int references product_variants(id),
  url text not null,
  alt_text varchar(255),
  sort_order int not null default 0,
  is_primary boolean not null default false
);

-- ============================================================
-- INVENTORY
-- ============================================================

create table warehouses (
  id serial primary key,
  store_id int not null references stores(id),
  name varchar(100) not null,
  city varchar(100) not null,
  address text not null,
  is_active boolean not null default true
);

create table inventory (
  id serial primary key,
  warehouse_id int not null references warehouses(id),
  variant_id int not null references product_variants(id),
  quantity int not null default 0,
  reserved_quantity int not null default 0,
  reorder_point int not null default 10,
  updated_at timestamptz not null default now(),
  unique(warehouse_id, variant_id)
);

create table purchase_orders (
  id serial primary key,
  store_id int not null references stores(id),
  supplier_id int not null references suppliers(id),
  warehouse_id int not null references warehouses(id),
  status varchar(30) not null default 'draft', -- draft, sent, confirmed, received, cancelled
  ordered_at timestamptz,
  expected_at date,
  received_at timestamptz,
  total_cost numeric(12,2),
  notes text
);

create table purchase_order_items (
  id serial primary key,
  purchase_order_id int not null references purchase_orders(id) on delete cascade,
  variant_id int not null references product_variants(id),
  quantity_ordered int not null,
  quantity_received int not null default 0,
  unit_cost numeric(10,2) not null
);

-- ============================================================
-- CUSTOMERS
-- ============================================================

create table customers (
  id serial primary key,
  store_id int not null references stores(id),
  email varchar(255) not null,
  first_name varchar(100),
  last_name varchar(100),
  phone varchar(50),
  date_of_birth date,
  gender varchar(10),
  is_active boolean not null default true,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  unique(store_id, email)
);

create table addresses (
  id serial primary key,
  customer_id int not null references customers(id) on delete cascade,
  type varchar(20) not null default 'shipping', -- shipping, billing
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  company varchar(255),
  street varchar(255) not null,
  city varchar(100) not null,
  postal_code varchar(20) not null,
  country varchar(2) not null,
  is_default boolean not null default false
);

-- ============================================================
-- ORDERS
-- ============================================================

create table orders (
  id serial primary key,
  store_id int not null references stores(id),
  customer_id int not null references customers(id),
  status varchar(30) not null default 'pending', -- pending, confirmed, processing, shipped, delivered, returned, cancelled
  shipping_address_id int references addresses(id),
  billing_address_id int references addresses(id),
  subtotal numeric(12,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,
  total numeric(12,2) not null,
  currency varchar(3) not null default 'PLN',
  payment_method varchar(50), -- card, blik, transfer, cod
  payment_status varchar(30) not null default 'pending', -- pending, paid, refunded, failed
  discount_code_id int, -- FK added after promotions table
  notes text,
  ordered_at timestamptz not null default now(),
  shipped_at timestamptz,
  delivered_at timestamptz
);

create table order_items (
  id serial primary key,
  order_id int not null references orders(id) on delete cascade,
  variant_id int not null references product_variants(id),
  product_name varchar(255) not null,
  variant_info jsonb,
  quantity int not null,
  unit_price numeric(10,2) not null,
  discount_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null
);

create table order_status_history (
  id serial primary key,
  order_id int not null references orders(id) on delete cascade,
  status varchar(30) not null,
  note text,
  changed_by int references employees(id),
  changed_at timestamptz not null default now()
);

-- ============================================================
-- PROMOTIONS
-- ============================================================

create table promotions (
  id serial primary key,
  store_id int not null references stores(id),
  name varchar(255) not null,
  description text,
  type varchar(30) not null, -- percentage, fixed, free_shipping, buy_x_get_y
  value numeric(10,2),
  min_order_amount numeric(10,2),
  applies_to varchar(30) not null default 'all', -- all, category, product
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_active boolean not null default true
);

create table discount_codes (
  id serial primary key,
  store_id int not null references stores(id),
  promotion_id int references promotions(id),
  code varchar(50) not null,
  usage_limit int,
  usage_count int not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  unique(store_id, code)
);

alter table orders add constraint fk_orders_discount_code
  foreign key (discount_code_id) references discount_codes(id);

-- ============================================================
-- REVIEWS & WISHLISTS
-- ============================================================

create table reviews (
  id serial primary key,
  product_id int not null references products(id) on delete cascade,
  customer_id int not null references customers(id),
  rating smallint not null check (rating between 1 and 5),
  title varchar(255),
  body text,
  is_verified_purchase boolean not null default false,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table wishlists (
  id serial primary key,
  customer_id int not null references customers(id) on delete cascade,
  product_id int not null references products(id) on delete cascade,
  variant_id int references product_variants(id),
  added_at timestamptz not null default now(),
  unique(customer_id, product_id, variant_id)
);

-- ============================================================
-- SHIPPING
-- ============================================================

create table shipping_methods (
  id serial primary key,
  store_id int not null references stores(id),
  name varchar(100) not null,
  carrier varchar(100),
  estimated_days_min int,
  estimated_days_max int,
  price numeric(10,2) not null,
  free_above numeric(10,2),
  is_active boolean not null default true
);

create table shipments (
  id serial primary key,
  order_id int not null references orders(id),
  shipping_method_id int references shipping_methods(id),
  tracking_number varchar(255),
  carrier varchar(100),
  shipped_at timestamptz,
  estimated_delivery date,
  delivered_at timestamptz,
  status varchar(30) not null default 'pending' -- pending, in_transit, delivered, returned
);

-- ============================================================
-- INDEXES for common query patterns
-- ============================================================

create index idx_products_store on products(store_id);
create index idx_products_category on products(category_id);
create index idx_products_active on products(is_active);
create index idx_orders_store on orders(store_id);
create index idx_orders_customer on orders(customer_id);
create index idx_orders_status on orders(status);
create index idx_orders_ordered_at on orders(ordered_at);
create index idx_order_items_order on order_items(order_id);
create index idx_customers_store on customers(store_id);
create index idx_customers_email on customers(email);
create index idx_inventory_variant on inventory(variant_id);
create index idx_reviews_product on reviews(product_id);
create index idx_reviews_rating on reviews(rating);
