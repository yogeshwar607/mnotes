-- Table: "Remittance".admin_role

-- DROP TABLE "Remittance".admin_role;

CREATE TABLE "Remittance".admin_role
(
  id serial NOT NULL,
  role character varying(30) NOT NULL,
  description character varying(100) NOT NULL,
  created_on timestamp(3) with time zone,
  createy_by character varying(100),
  is_deleted boolean DEFAULT false,
  modified_on timestamp(3) with time zone,
  modified_by character varying(100)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".admin_role
  OWNER TO postgres;

-- Table: "Remittance".admin_role_map

-- DROP TABLE "Remittance".admin_role_map;

CREATE TABLE "Remittance".admin_role_map
(
  id integer NOT NULL DEFAULT nextval('"Remittance".admin_role_id_seq'::regclass),
  role_id integer NOT NULL,
  page_name character varying(100) NOT NULL,
  created_on timestamp(3) with time zone,
  created_by character varying(100),
  is_deleted boolean DEFAULT false,
  modified_on timestamp(3) with time zone DEFAULT now(),
  modified_by character varying(100),
  CONSTRAINT role_mapping PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".admin_role_map
  OWNER TO postgres;


-- Table: "Remittance".admin_user

-- DROP TABLE "Remittance".admin_user;

CREATE TABLE "Remittance".admin_user
(
  id uuid NOT NULL,
  email character varying(100) NOT NULL,
  password character varying(100) NOT NULL,
  role_id integer,
  created_on timestamp(3) with time zone,
  created_by character varying(100),
  is_deleted boolean DEFAULT false,
  modified_on timestamp(3) with time zone DEFAULT now(),
  modified_by character varying(100),
  CONSTRAINT admin_user_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".admin_user
  OWNER TO postgres;


-- Table: "Remittance".country

-- DROP TABLE "Remittance".country;

CREATE TABLE "Remittance".country
(
  code character varying(10),
  name character varying(20),
  currency_code character varying(10),
  currency_symbol character varying(3),
  is_sender boolean NOT NULL DEFAULT false,
  is_receiver boolean NOT NULL DEFAULT false,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_on timestamp(3) with time zone,
  created_on time(3) with time zone,
  created_by character varying(100),
  modified_on timestamp(3) with time zone,
  modified_by character varying(100)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".country
  OWNER TO postgres;

-- Table: "Remittance".customer

-- DROP TABLE "Remittance".customer;

CREATE TABLE "Remittance".customer
(
  registration_id uuid NOT NULL,
  email character varying(100) NOT NULL,
  password character varying(100) NOT NULL,
  source character varying(20),
  type character varying(20),
  is_email_verified boolean,
  email_verified_on timestamp(3) without time zone,
  is_otp_verified boolean DEFAULT false,
  otp_verified_on timestamp(3) with time zone,
  is_transfer_activated boolean DEFAULT false,
  transfer_activated_on timestamp(3) with time zone,
  is_account_blocked boolean DEFAULT false,
  is_transaction_blocked boolean DEFAULT false,
  last_logged_in timestamp(3) with time zone,
  created_on timestamp(3) with time zone,
  modified_on timestamp(3) with time zone, -- 
  modified_by character varying(100),
  UNIQUE (email),
  CONSTRAINT customer1_pkey PRIMARY KEY (registration_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".customer
  OWNER TO postgres;
COMMENT ON COLUMN "Remittance".customer.modified_on IS '
';


-- Table: "Remittance".customer_geo_detail

-- DROP TABLE "Remittance".customer_geo_detail;

CREATE TABLE "Remittance".customer_geo_detail
(
  registration_id uuid,
  activity_type character varying(20),
  ip_address character varying(50),
  country character varying(20),
  city character varying(20),
  browser character varying(100),
  device character varying(100),
  created_on timestamp(3) with time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".customer_geo_detail
  OWNER TO postgres;


-- Table: "Remittance".individual_doc_detail

-- DROP TABLE "Remittance".individual_doc_detail;

CREATE TABLE "Remittance".individual_doc_detail
(
  id serial NOT NULL,
  registration_id uuid NOT NULL,
  doc_type character varying(20),
  doc_path character varying(100),
  is_deleted boolean DEFAULT false,
  deleted_on timestamp(3) with time zone,
  deleted_by character varying(100),
  is_verified boolean DEFAULT false,
  verified_on timestamp(3) with time zone,
  verified_by character varying(100),
  uploaded_on timestamp(3) with time zone,
  uploaded_by character varying(100),
  comment json,
  doc_detail json
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".individual_doc_detail
  OWNER TO postgres;

-- Table: "Remittance".individual_customer_detail

-- DROP TABLE "Remittance".individual_customer_detail;

CREATE TABLE "Remittance".individual_customer_detail
(
  registration_id uuid NOT NULL,
  country_of_residence character varying(20) NOT NULL,
  country_of_transaction character varying(20) NOT NULL,
  first_name character varying(50),
  middle_name character varying(50),
  last_name character varying(50),
  title character varying(20),
  dob date,
  address_line1 character varying(100),
  address_line2 character varying(100),
  postal_code character varying(20),
  mobile_country_code character varying(5),
  mobile_no character varying(15),
  state character varying(15),
  city character varying(25),
  nationality character varying(10),
  employment_status character varying(100),
  source_of_funds character varying(100),
  is_pep boolean DEFAULT false,
  intended_use_of_account character varying(100),
  net_worth character varying(50),
  type_of_industry character varying(100),
  is_dual_citizen boolean DEFAULT false,
  created_on timestamp(3) with time zone DEFAULT now(),
  modified_on timestamp(3) with time zone DEFAULT now(),
  modified_by character varying(100)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".individual_customer_detail
  OWNER TO postgres;

-- Table: "Remittance".initial_verification

-- DROP TABLE "Remittance".initial_verification;

CREATE TABLE "Remittance".initial_verification
(
  id serial NOT NULL,
  doc_id integer,
  registration_id uuid,
  is_approved boolean,
  approve_on timestamp(3) with time zone,
  approved_by character varying(100),
  comment json
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".initial_verification
  OWNER TO postgres;


-- Table: "Remittance".user_data_verification

-- DROP TABLE "Remittance".user_data_verification;

CREATE TABLE "Remittance".user_data_verification
(
  id serial NOT NULL,
  registration_id uuid,
  is_approved boolean,
  approved_on timestamp(3) with time zone,
  approved_by character varying(100),
  comment json
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".user_data_verification
  OWNER TO postgres;

-- Table: "Remittance".watchlist_detail

-- DROP TABLE "Remittance".watchlist_detail;

CREATE TABLE "Remittance".watchlist_detail
(
  id serial NOT NULL,
  registration_id uuid,
  is_watchlist_hit boolean NOT NULL DEFAULT false,
  hit_detail character varying(1000),
  is_verified boolean NOT NULL DEFAULT false,
  verified_on timestamp(3) with time zone,
  verified_by character varying(100),
  comment json,
  created_on timestamp(3) with time zone,
  created_by character varying(100),
  modified_on timestamp(3) with time zone,
  modified_by character varying(100),
  type character varying(10)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Remittance".watchlist_detail
  OWNER TO postgres;